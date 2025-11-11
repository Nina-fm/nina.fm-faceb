# Instructions GitHub Copilot - Nina.fm Face B (Admin)

## Architecture Générale

**Type de projet :** Application admin Nuxt 3 (Vue 3 + TypeScript + Vuetify 3) - Interface d'administration Nina.fm  
**Stack technique :** Nuxt 3.2.3, Vue 3, TypeScript, Vuetify 3.5.1, Pinia, Supabase, **SPA Mode (ssr: false)**

## Vue d'ensemble

Interface d'administration pour gérer les mixtapes, auteurs, tags et médias de Nina.fm.
Authentification via Supabase, stockage Supabase Storage, API Supabase Functions.

## Structure du Projet

```
components/
├── fields/         # Champs formulaires (AuthorsField, TagsField, etc.)
├── forms/          # Formulaires complets (MixtapeForm, AuthorForm, TagForm)
├── lists/          # Listes de données (MixtapesList, AuthorsList, etc.)
└── dialogs/        # Modales (ConfirmDialog, etc.)

composables/
├── api.ts          # Client API Supabase Functions
├── buckets.ts      # Gestion uploads Supabase Storage
└── process.ts      # Wrapper async avec états de chargement

stores/
├── auth.ts         # Authentification Supabase
├── profile.ts      # Profil utilisateur
├── mixtapes.ts     # CRUD mixtapes
├── authors.ts      # CRUD auteurs
├── tags.ts         # CRUD tags
├── loading.ts      # États de chargement globaux
└── snackbar.ts     # Notifications toast

pages/
├── index.vue       # Dashboard
├── login.vue       # Page connexion
├── mixtapes/       # Gestion mixtapes
│   ├── index.vue
│   ├── create.vue
│   └── [id].vue
├── authors/        # Gestion auteurs
└── tags/           # Gestion tags

plugins/
├── supabase.ts     # Client Supabase personnalisé
└── vuetify.ts      # Configuration Vuetify + thème
```

## Configuration & Environnement

### Variables d'environnement requises

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbG...
SUPABASE_FUNCTIONS_URL=https://xxx.functions.supabase.co

# Site
SITE_URL=https://www.nina.fm

# API Streaming (optionnel pour affichage current track)
STREAM_API_URL=https://libretime.nina.fm/api/live-info
STREAM_API_URL_FALLBACK=http://flux.nina.fm/status-json.xsl
```

### ⚠️ CRITIQUE : Mode SPA et Variables d'Environnement

**Le projet utilise `ssr: false` (mode SPA)**. Cela signifie :

1. ❌ `process.env.*` N'EST PAS disponible côté client
2. ❌ `useRuntimeConfig().public.*` N'EST PAS accessible en SPA mode
3. ✅ **Solution** : Utiliser `vite.define` pour injecter au build-time

### Pattern d'injection des variables

**nuxt.config.ts:**

```typescript
export default defineNuxtConfig({
  ssr: false,
  vite: {
    define: {
      __SUPABASE_URL__: JSON.stringify(process.env.SUPABASE_URL),
      __SUPABASE_KEY__: JSON.stringify(process.env.SUPABASE_KEY),
      __SUPABASE_FUNCTIONS_URL__: JSON.stringify(process.env.SUPABASE_FUNCTIONS_URL),
    },
  },
})
```

**Utilisation dans le code:**

```typescript
// Déclarer les constantes globales
declare const __SUPABASE_URL__: string
declare const __SUPABASE_KEY__: string

// Utiliser directement
const supabaseUrl = __SUPABASE_URL__ || ""
const supabaseKey = __SUPABASE_KEY__ || ""
```

**⚠️ NE JAMAIS utiliser :**

```typescript
// ❌ FAUX - Ne fonctionne pas en SPA
const config = useRuntimeConfig()
const url = config.public.supabase.url

// ❌ FAUX - Undefined côté client
const url = process.env.SUPABASE_URL
```

## Supabase Integration

### Plugin Supabase personnalisé

**plugins/supabase.ts:**

```typescript
import { createClient } from "@supabase/supabase-js"

declare const __SUPABASE_URL__: string
declare const __SUPABASE_KEY__: string

export default defineNuxtPlugin(() => {
  const supabaseUrl = __SUPABASE_URL__ || ""
  const supabaseKey = __SUPABASE_KEY__ || ""

  const supabase = createClient(supabaseUrl, supabaseKey)

  return {
    provide: { supabase },
  }
})
```

### Utilisation dans les stores/composables

```typescript
// Dans un store
const { $supabase } = useNuxtApp()
const { data, error } = await $supabase.from("mixtapes").select("*")

// Dans auth.ts
const { data, error } = await $supabase.auth.signInWithPassword({
  email,
  password,
})
```

### API Composable

**composables/api.ts:**

```typescript
declare const __SUPABASE_KEY__: string
declare const __SUPABASE_FUNCTIONS_URL__: string

export const useApi = () => {
  const { token } = useAuthStoreRefs()
  const apikey = __SUPABASE_KEY__ || ""
  const baseURL = __SUPABASE_FUNCTIONS_URL__ || ""

  const call = async (path: string, method?: Methods, options?: ApiOptions) => {
    return await $fetch(path, {
      method,
      baseURL,
      headers: {
        apikey,
        Authorization: `Bearer ${token.value}`,
      },
      body: options?.body,
    })
  }

  return { get: callGet, post: callPost /* ... */ }
}
```

## Stores Pinia

### Pattern général

```typescript
export const useXStore = defineStore("x", () => {
  const data = ref<X[]>([])
  const index = ref<ObjectOf<X>>()

  const fetchX = async () => {
    const result = await api.get("/x")
    // ⚠️ IMPORTANT: Toujours vérifier que result est un tableau
    if (!Array.isArray(result)) {
      data.value = []
      index.value = {}
      return
    }
    data.value = result
    index.value = result.reduce((r, x) => ({ ...r, [x.id]: x }), {})
  }

  return { data, index, fetchX }
})

export const useXStoreRefs = () => storeToRefs(useXStore())
```

### ⚠️ Guards obligatoires

Toujours ajouter `Array.isArray()` dans les fetch et computed :

```typescript
// Dans fetchMixtapes
if (!Array.isArray(result)) {
  data.value = []
  index.value = {}
  return
}

// Dans computed
const filteredData = computed(() => {
  if (!Array.isArray(data.value)) return []
  return data.value.filter(/* ... */)
})

// Dans update
if (Array.isArray(data.value)) {
  data.value = [...data.value.filter((a) => a.id !== id), result]
}
```

**Raison :** En mode SPA, si l'API retourne du HTML au lieu de JSON (404, erreur réseau, etc.),
`result` sera une string HTML, et `.filter()/.reduce()` plantera.

## Vuetify Configuration

### Plugin Vuetify

**plugins/vuetify.ts:**

```typescript
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false, // ⚠️ IMPORTANT pour mode SPA
    theme: {
      defaultTheme: "NinaTheme",
      themes: { NinaTheme },
    },
    components,
    directives,
    defaults: {
      VTextField: { variant: "outlined", hideDetails: "auto" },
      VSelect: { variant: "outlined", hideDetails: "auto" },
      // ...
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
```

## Déploiement Docker

### Dockerfile

**Points clés :**

- Base image: `node:18-alpine` (⚠️ Supabase JS 2.81.1 supporte Node 18, éviter Node 20 requirement)
- Multi-stage: `dependencies` → `build` → `production`
- **IMPORTANT:** Copier `node_modules` depuis `dependencies` stage au lieu de réinstaller

  ```dockerfile
  # ✅ BON
  COPY --from=dependencies --chown=nuxtjs:nodejs /app/node_modules ./node_modules

  # ❌ MAUVAIS - Déclencherait l'erreur "requires Node >=20"
  RUN yarn install --production
  ```

- Build args: `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_FUNCTIONS_URL`, `SITE_URL`, etc.
- Healthcheck: `curl -f http://127.0.0.1:3002/ || exit 1`

### docker-compose.prod.yml

```yaml
services:
  nina-faceb:
    image: ghcr.io/nina-fm/nina.fm-faceb:latest
    container_name: nina-faceb
    restart: unless-stopped
    ports:
      - "127.0.0.1:3002:3002"
    env_file: ../.env.prod
    networks:
      - nina-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:3002/"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  nina-network:
    external: true
```

### .env.prod (serveur)

```env
NODE_ENV=production
PORT=3002
HOST=0.0.0.0
SITE_URL=https://www.nina.fm
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbG...
SUPABASE_FUNCTIONS_URL=https://xxx.functions.supabase.co
STREAM_API_URL=https://libretime.nina.fm/api/live-info
STREAM_API_URL_FALLBACK=http://flux.nina.fm/status-json.xsl
```

## CI/CD - GitHub Actions

### Workflow `.github/workflows/deploy.yml`

**Variables GitHub requises :**

- `SITE_URL`
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SUPABASE_FUNCTIONS_URL`
- `STREAM_API_URL`
- `STREAM_API_URL_FALLBACK`

**Secrets GitHub requis :**

- `SERVER_HOST`
- `SERVER_USER`
- `SSH_PRIVATE_KEY`

**Jobs :**

1. **test** - Lint + Build avec toutes les env vars
2. **build** - Build Docker image avec build-args + push GHCR
3. **deploy** -
   - Pull image
   - Créer `.env.prod` sur serveur
   - Copy `docker-compose.prod.yml` via SCP
   - Start containers avec `docker compose up -d --wait`
4. **cleanup** - Prune anciennes images

**⚠️ Build args dans workflow :**

```yaml
build-args: |
  SITE_URL=${{ vars.SITE_URL }}
  SUPABASE_URL=${{ vars.SUPABASE_URL }}
  SUPABASE_KEY=${{ vars.SUPABASE_KEY }}
  SUPABASE_FUNCTIONS_URL=${{ vars.SUPABASE_FUNCTIONS_URL }}
  STREAM_API_URL=${{ vars.STREAM_API_URL }}
  STREAM_API_URL_FALLBACK=${{ vars.STREAM_API_URL_FALLBACK }}
```

## Nginx Configuration

### /etc/nginx/sites-available/faceb.nina.fm.conf

```nginx
server {
  server_name faceb.nina.fm;

  location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  listen 443 ssl;
  ssl_certificate /etc/letsencrypt/live/faceb.nina.fm/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/faceb.nina.fm/privkey.pem;
}
```

**Vérifier lien symbolique :**

```bash
ninsh "ls -la /etc/nginx/sites-enabled/ | grep faceb"
```

## Types & Utilitaires

### formatAuthors.ts

```typescript
// utils/formatAuthors.ts
export const formatAuthorNames = (authors: (AuthorLike | string)[]): string => {
  if (!Array.isArray(authors)) return ""
  return authors.reduce<string>((result, author, index) => {
    const name = typeof author === "string" ? author : author.name
    if (index === 0) return `${name}`
    else if (index >= authors.length - 1) return `${result} & ${name}`
    else return `${result}, ${name}`
  }, "")
}
```

**⚠️ Guard `Array.isArray()` obligatoire** pour éviter "reduce is not a function"

### Supabase Types

```typescript
interface MixtapeExt {
  id: number
  name: string
  cover_url: string | null
  authors: AuthorExt[]
  tags: Tag[]
  created_at: string
  updated_at: string
}

interface AuthorExt {
  id: number
  name: string
  // ...
}

interface Tag {
  id: number
  name: string
  color: string
}
```

## Scripts npm

```json
{
  "dev": "nuxt dev",
  "build": "nuxt build",
  "preview": "nuxt preview",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

## Monitoring & Debug

### Vérifier status conteneur

```bash
ninsh "docker ps --filter name=nina-faceb"
```

### Logs

```bash
ninsh "docker logs -f nina-faceb"
ninsh "docker logs nina-faceb --tail 50"
```

### Test local Docker

```bash
docker build \
  --build-arg SUPABASE_URL=https://xxx.supabase.co \
  --build-arg SUPABASE_KEY=eyJ... \
  --build-arg SUPABASE_FUNCTIONS_URL=https://xxx.functions.supabase.co \
  --build-arg SITE_URL=https://www.nina.fm \
  --target production \
  -t nina-faceb-test:latest .

docker run --rm -d -p 3003:3002 --name nina-faceb-test nina-faceb-test:latest
# Test: http://localhost:3003
```

### Vérifier variables compilées

```bash
docker exec nina-faceb grep -r "fsomngzmdtaaqfgpdfed" .output/
```

## Problèmes Connus & Solutions

### 1. Variables d'env undefined en production

**Symptômes :**

- Console log montre `undefined` pour SUPABASE_URL
- API retourne du HTML au lieu de JSON
- Erreur "r.value.filter is not a function"

**Cause :** Mode SPA (`ssr: false`) ne supporte pas `runtimeConfig` ou `process.env` côté client

**Solution :**

```typescript
// nuxt.config.ts
vite: {
  define: {
    __SUPABASE_URL__: JSON.stringify(process.env.SUPABASE_URL),
  }
}

// plugin/composable
declare const __SUPABASE_URL__: string
const url = __SUPABASE_URL__ || ""
```

### 2. Node 20 requirement error

**Symptômes :**

```
@supabase/supabase-js@2.81.1: The engine 'node' is incompatible.
Expected >=20.0.0. Got 18.20.8
```

**Cause :** Production stage essaie de réinstaller dependencies avec `yarn install --production`

**Solution :** Copier node_modules depuis dependencies stage

```dockerfile
COPY --from=dependencies --chown=nuxtjs:nodejs /app/node_modules ./node_modules
```

### 3. TypeError: Cannot read properties of undefined (reading 'classList')

**Symptômes :** Erreur console au chargement, mais app fonctionne

**Cause :** Vuetify essaie d'accéder au DOM avant qu'il soit prêt en mode SPA

**Solution :** Ajouter `ssr: false` dans config Vuetify (déjà fait, erreur non bloquante)

### 4. API retourne HTML au lieu de JSON

**Symptômes :** Console log `❌ Mixtapes fetch: result is not an array <!DOCTYPE html>`

**Cause :** `SUPABASE_FUNCTIONS_URL` manquant ou incorrect

**Solution :** Vérifier que la variable est bien définie dans `vite.define` et passée en build-arg

### 5. Healthcheck fails (IPv6)

**Symptômes :** `ECONNREFUSED ::1:3002`

**Cause :** `localhost` résout vers `::1` (IPv6) mais app bind sur `0.0.0.0`

**Solution :** Utiliser `127.0.0.1` au lieu de `localhost` dans healthcheck

```dockerfile
HEALTHCHECK CMD curl -f http://127.0.0.1:3002/ || exit 1
```

## Conventions de Code

1. **TypeScript strict** : Toujours typer
2. **Array guards** : Toujours `Array.isArray()` avant `.filter()/.reduce()`
3. **Stores** : Pattern `useXStore()` + `useXStoreRefs()`
4. **Env vars** : Utiliser `__CONSTANTS__` globales, jamais `process.env` ou `runtimeConfig`
5. **API calls** : Toujours wrapper dans try/catch avec gestion erreur
6. **Forms** : Valider côté client ET serveur
7. **Uploads** : Utiliser composable `buckets.ts` pour Supabase Storage

## Performance

- **Build time:** ~25-40 secondes
- **Bundle size:** ~2-3 MB (gzipped)
- **First load:** < 2s
- **Mémoire conteneur:** ~100-150 MB
- **CPU:** < 1%

## Règles de Développement

1. Ne jamais utiliser `process.env` ou `useRuntimeConfig()` en mode SPA
2. Toujours déclarer les constantes globales avec `declare const`
3. Toujours ajouter des guards `Array.isArray()` dans les stores
4. Tester localement avec Docker avant de push
5. Vérifier que les variables GitHub sont à jour avant déploiement
6. Garder Dockerfile aligned avec Node 18 (pas de upgrade vers Node 20)
7. Ne jamais réinstaller node_modules en production stage du Dockerfile
