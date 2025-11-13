# Dev Memo - Face B v2

## ✅ État actuel (Novembre 2025)

### Fonctionnalités complètes

- ✅ **Authentification** : Login, register, logout, refresh tokens
- ✅ **Profil utilisateur** : Édition profil + upload avatar
- ✅ **Invitations** : Système complet (envoi, validation, annulation, renvoi)
- ✅ **Tags** : CRUD complet avec permissions
- ✅ **DJs** : CRUD complet avec permissions
- ✅ **Mixtapes** : CRUD complet + cover upload + gestion tracks
- ✅ **Synchronisation types** : Script `pnpm types:sync` depuis API Swagger

### Architecture établie

- **Stack** : Nuxt 3 + Vue 3 + TypeScript + TanStack Query + Pinia
- **UI** : shadcn-vue (reka-ui) + Tailwind CSS
- **Forms** : vee-validate + zod
- **API** : NestJS backend avec DTOs typés
- **Types** : Génération automatique depuis OpenAPI/Swagger

## 🔧 Patterns validés

### 1. API Composables

Pattern standard avec TanStack Query :

- Queries pour lecture (`useQuery`)
- Mutations pour écriture (`useMutation`)
- Invalidation automatique du cache
- Error handlers centralisés
- Helpers réutilisables dans `apiHelpers.ts`

### 2. Formulaires

Pattern vee-validate + zod :

- Schema zod pour validation
- Composants Field réutilisables
- Teleport pour boutons header
- État dirty pour optimisation

### 3. Réponses API

Format unifié `{ data: T }` ou `{ data: T[], meta: {...} }` :

- Plus de workarounds de cast
- Types cohérents
- Gestion simplifiée

### 4. TypeORM updates

Règle importante pour vider un champ :

- `undefined` → pas de mise à jour
- `''` ou `null` → champ vidé
- Exemple : `tracksAsText: tracks?.length ? serialize(tracks) : ''`

## 🚀 Scripts utiles

```bash
# Synchroniser les types depuis l'API
pnpm types:sync

# Démarrer le dev (frontend seul)
pnpm dev

# Démarrer fullstack (frontend + backend)
pnpm dev:stack

# Générer les types (appelé par types:sync)
./scripts/generate-types.sh
```

## 📋 Prochaines étapes suggérées

1. **Tests end-to-end** : Valider tous les flows utilisateur
2. **Optimisations** : Infinite query pour grandes listes
3. **Features manquantes** :
   - Mix sessions (streaming)
   - Gestion avancée des permissions
   - Statistiques et analytics

## 🔗 Ressources

- API Swagger : `http://localhost:3000/api-docs`
- Documentation API : `/Users/vincent/Sites/nina/nina.fm-api/docs/`
- Instructions Copilot : `.github/copilot-instructions.md`
