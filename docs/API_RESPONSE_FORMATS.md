# API Response Formats - Investigation et Harmonisation

## Statut : 🔍 En cours d'investigation

## Problème identifié

Les endpoints de l'API Nina.fm retournent des formats de réponse incohérents :

### Format 1 : Enveloppe avec `data`

```typescript
{
  data: T,
  meta?: {
    // informations supplémentaires
  }
}
```

### Format 2 : Retour direct

```typescript
T
```

### Format 3 : Liste paginée

```typescript
{
  data: T[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

## Cas observés

### Mixtapes

#### ✅ `GET /mixtapes` (liste)

```json
{
  "data": [{ "id": "...", "name": "..." }],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

**Type attendu** : `PaginatedResponse<Mixtape>`

#### ❌ `GET /mixtapes/:id` (détail)

**Retour actuel** : Objet `Mixtape` directement

```json
{
  "id": "...",
  "name": "...",
  "year": 2025
}
```

**Type déclaré dans frontend** : `{ data: Mixtape }`
**Type réel** : `Mixtape`

**Impact** :

```typescript
// ❌ Ne fonctionne pas
const mixtape = computed(() => mixtapeData.value?.data)

// ✅ Workaround actuel
const mixtape = computed(
  () => (mixtapeData.value?.data as unknown as Mixtape) || (mixtapeData.value as unknown as Mixtape),
)
```

#### `POST /mixtapes` (création)

**À vérifier** : Format de retour

#### `PATCH /mixtapes/:id` (modification)

**À vérifier** : Format de retour

#### `DELETE /mixtapes/:id` (suppression)

**À vérifier** : Format de retour

### Autres ressources

#### Tags

- `GET /tags` : À vérifier
- `GET /tags/:id` : À vérifier

#### DJs

- `GET /djs` : À vérifier
- `GET /djs/:id` : À vérifier

#### Users

- `GET /users` : À vérifier
- `GET /users/:id` : À vérifier

## Décision d'architecture à prendre

### Option 1 : Tout envelopper dans `{ data: T }`

**Avantages** :

- Cohérent avec les listes paginées
- Permet d'ajouter des métadonnées facilement
- Pattern standard dans beaucoup d'APIs REST

**Inconvénients** :

- Plus verbeux
- Nécessite de déballer `data` partout

### Option 2 : Retour direct pour détails, enveloppe pour listes

**Avantages** :

- Plus concis pour les détails
- Distinction claire liste/détail

**Inconvénients** :

- Moins cohérent
- Types plus complexes côté frontend

### Recommandation : Option 1

✅ Envelopper TOUS les retours dans `{ data: T }` ou `{ data: T[], meta: {...} }`

## Plan d'action

### 1. Investigation API (Backend)

```bash
cd /Users/vincent/Sites/nina/nina.fm-api
```

#### À vérifier dans chaque module :

- [ ] `src/mixtapes/mixtapes.controller.ts`
- [ ] `src/djs/djs.controller.ts`
- [ ] `src/tags/tags.controller.ts`
- [ ] `src/users/users.controller.ts`

#### Pour chaque endpoint :

```typescript
// ❌ Retour direct
@Get(':id')
async findOne(@Param('id') id: string): Promise<Mixtape> {
  return this.mixtapesService.findOne(id)
}

// ✅ Retour enveloppé
@Get(':id')
async findOne(@Param('id') id: string): Promise<{ data: Mixtape }> {
  const mixtape = await this.mixtapesService.findOne(id)
  return { data: mixtape }
}
```

### 2. Harmonisation API (Backend)

#### Créer un helper/interceptor

```typescript
// src/common/interceptors/response.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, { data: T }> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<{ data: T }> {
    return next.handle().pipe(
      map((data) => {
        // Si déjà enveloppé, ne rien faire
        if (data && typeof data === 'object' && 'data' in data) {
          return data
        }
        // Sinon, envelopper
        return { data }
      }),
    )
  }
}
```

#### Appliquer globalement

```typescript
// src/main.ts
app.useGlobalInterceptors(new ResponseInterceptor())
```

OU appliquer par controller :

```typescript
@Controller('mixtapes')
@UseInterceptors(ResponseInterceptor)
export class MixtapesController {}
```

### 3. Mise à jour des types (Backend)

```typescript
// src/common/dto/response.dto.ts
export class DataResponse<T> {
  data: T
}

export class PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

Utiliser dans les controllers :

```typescript
@Get(':id')
async findOne(@Param('id') id: string): Promise<DataResponse<Mixtape>> {
  const mixtape = await this.mixtapesService.findOne(id)
  return { data: mixtape }
}
```

### 4. Synchronisation des types (Frontend)

Une fois l'API harmonisée, mettre à jour les types frontend :

```typescript
// types/api-config.ts
export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

Puis dans les composables API :

```typescript
const getResource = (id: MaybeRef<string>) =>
  useQuery({
    queryKey: computed(() => queryKeys.resources.detail(unref(id))),
    queryFn: async () => {
      return call<ApiResponse<Resource>>(API_ENDPOINTS.RESOURCES.BY_ID(unref(id)), {
        method: HttpMethod.GET,
        requireAuth: true,
      })
    },
    enabled: computed(() => !!unref(id)),
  })
```

### 5. Mise à jour des pages (Frontend)

Supprimer les workarounds :

```typescript
// ❌ Avant
const resource = computed(() => (data.value?.data as unknown as Resource) || (data.value as unknown as Resource))

// ✅ Après
const resource = computed(() => data.value?.data)
```

## Checklist

### Backend

- [ ] Auditer tous les controllers (mixtapes, djs, tags, users)
- [ ] Identifier tous les endpoints retournant directement T
- [ ] Décider du pattern (Option 1 recommandée)
- [ ] Créer ResponseInterceptor si nécessaire
- [ ] Mettre à jour tous les endpoints
- [ ] Mettre à jour les types de retour
- [ ] Tester tous les endpoints
- [ ] Mettre à jour la documentation Swagger/OpenAPI

### Frontend

- [ ] Mettre à jour types/api-config.ts
- [ ] Mettre à jour tous les composables API
- [ ] Supprimer les workarounds dans les pages
- [ ] Tester tous les flows (list/detail/create/update/delete)
- [ ] Vérifier qu'il n'y a plus d'erreurs TypeScript

## Notes

- Cette harmonisation est **critique** pour la maintenabilité
- À faire **avant** d'implémenter de nouvelles features
- Nécessite une coordination Backend/Frontend
- Impacte potentiellement tous les modules

## Références

- [NestJS Interceptors](https://docs.nestjs.com/interceptors)
- [API Response Design Best Practices](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)
