# 🎛️ Nina.fm Face B

Interface d'administration moderne pour la plateforme Nina.fm, développée avec Nuxt 3, TypeScript et TanStack Query. Cette application backoffice permet de gérer entièrement le contenu et les utilisateurs de Nina.fm.

## ✨ Fonctionnalités

- 🎧 **Gestion des mixtapes** - CRUD complet avec upload de covers et gestion des tags/DJs
- 👥 **Administration utilisateurs** - Gestion des profils, rôles et permissions
- 🏷️ **Système de tags** - Organisation et catégorisation du contenu
- 🎵 **Gestion des DJs** - Profils, biographies et associations aux mixtapes
- 🖼️ **Bibliothèque média** - Upload et gestion centralisée des images
- 🔐 **Authentification sécurisée** - JWT avec refresh automatique et protection des routes
- 📧 **Système d'invitations** - Contrôle d'accès par invitation pour sécuriser l'administration
- 📊 **Pagination intelligente** - Navigation optimisée dans les grandes listes de données
- 🎨 **Interface moderne** - Design responsive avec Tailwind CSS et composants réutilisables
- ⚡ **Performance optimisée** - Cache intelligent avec TanStack Query et SSR Nuxt 3

## 🏗️ Architecture

```
Nina.fm Face B
├── 🎯 Nuxt 3 (Framework Vue.js)
├── 🔄 TanStack Query (Cache et état)
├── 🎨 Tailwind CSS (Styling)
├── 📝 TypeScript (Type safety)
├── 🗂️ Pinia (Store management)
├── 🔐 JWT Auth (Authentification)
├── 📊 API Nina.fm (Backend)
└── 🐳 Docker (Conteneurisation)
```

## 🚀 Démarrage rapide

### 🔧 Développement local

```bash
# 1. Cloner le projet
git clone https://github.com/Nina-fm/nina.fm-faceb.git
cd nina.fm-faceb

# 2. Installer les dépendances
pnpm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditez .env avec l'URL de votre API

# 4. Générer les types depuis l'API
pnpm generate:types

# 5. Démarrer en mode développement
pnpm dev

# 6. Accéder à l'application
open http://localhost:3002
```

### 📦 Scripts disponibles

```bash
pnpm dev             # Développement avec hot-reload
pnpm build           # Construction pour production
pnpm preview         # Aperçu de la version de production
pnpm generate:types  # Génération des types depuis l'API
pnpm lint            # Vérification du code
pnpm changeset       # Créer un changeset pour versioning
```

## 🌐 Production

### 🔄 Déploiement automatique

Le déploiement en production est **entièrement automatisé** via GitHub Actions :

1. **Push sur `main`** → Déclenche le déploiement
2. **Versioning automatique** avec Changesets
3. **Construction Docker** avec Node.js 20 et Nginx
4. **Déploiement** sur le serveur avec mise à jour automatique
5. **Tests de santé** et validation

### 🛡️ Sécurité

- ✅ **Accès par invitation uniquement** - Système d'invitation obligatoire pour l'inscription
- ✅ **Authentification JWT** - Tokens sécurisés avec refresh automatique
- ✅ **Protection des routes** - Middleware d'authentification sur toutes les pages sensibles
- ✅ **Validation des permissions** - Contrôle d'accès basé sur les rôles utilisateurs
- ✅ **HTTPS forcé** - Communication chiffrée en production

## 📚 Documentation

### 🚀 **Guides principaux**

- 📖 **[Plan de migration](PLAN_MIGRATION_FACE_B.md)** - Roadmap complète de la migration
- 🏗️ **[Architecture](docs/ARCHITECTURE.md)** - Structure et patterns utilisés
- 🔧 **[Configuration](docs/SETUP.md)** - Setup développement et production

### ⚙️ **Composants et API**

- 🎨 **[Guide des composants](docs/COMPONENTS.md)** - Bibliothèque de composants UI
- 🔌 **[Composables API](docs/API-COMPOSABLES.md)** - Documentation des composables d'API
- 📊 **[Système de pagination](docs/PAGINATION.md)** - Utilisation de la pagination
- 🗂️ **[Stores Pinia](docs/STORES.md)** - Gestion d'état et stores

### 🔐 **Sécurité et permissions**

- 🛡️ **[Système d'invitations](docs/INVITATIONS.md)** - Gestion des invitations et onboarding
- 🔑 **[Authentification](docs/AUTH.md)** - Flow d'authentification et sécurité
- 👤 **[Permissions](docs/PERMISSIONS.md)** - Système de rôles et permissions

## 🎨 Interface utilisateur

### Pages principales

- **`/`** - Dashboard principal avec statistiques
- **`/mixtapes`** - Gestion des mixtapes (liste, création, édition)
- **`/djs`** - Administration des profils DJs
- **`/tags`** - Gestion des tags et catégories
- **`/users`** - Administration des utilisateurs
- **`/invitations`** - Gestion des invitations (admin uniquement)
- **`/media`** - Bibliothèque d'images et médias

### Composants réutilisables

- **`DataTable`** - Tables avec pagination, tri et filtrage
- **`FilterBar`** - Barre de filtres dynamique
- **`ImageUpload`** - Upload d'images avec prévisualisation
- **`TagSelector`** - Sélecteur de tags avec autocomplétion
- **`InvitationForm`** - Formulaire d'envoi d'invitations

## 🛠️ Technologies

### Frontend

- **[Nuxt 3](https://nuxt.com/)** v3.11 - Framework Vue.js full-stack
- **[Vue 3](https://vuejs.org/)** v3.4 - Framework JavaScript reactif
- **[TypeScript](https://www.typescriptlang.org/)** v5 - Langage principal
- **[TanStack Query](https://tanstack.com/query)** v5 - Cache et synchronisation des données
- **[Pinia](https://pinia.vuejs.org/)** v2 - Store management
- **[Tailwind CSS](https://tailwindcss.com/)** v3 - Framework CSS utility-first

### Outils de développement

- **[VueUse](https://vueuse.org/)** - Collection d'utilitaires Vue
- **[Headless UI](https://headlessui.com/)** - Composants accessibles
- **[Heroicons](https://heroicons.com/)** - Icônes SVG
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Qualité du code

### DevOps

- **[Docker](https://www.docker.com/)** - Conteneurisation
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[Changesets](https://github.com/changesets/changesets)** - Versioning
- **[Nginx](https://nginx.org/)** - Serveur web en production

## 🔄 État de la migration

Ce projet est en cours de migration de Supabase/Prisma vers l'API Nina.fm. Consultez le [Plan de migration](PLAN_MIGRATION_FACE_B.md) pour suivre l'avancement.

### ✅ Phases terminées

- **Phase 1** : Setup et configuration de base ✅
- **Phase 2** : Migration de l'authentification ✅
- **Phase 2.6** : Harmonisation ownership & guards (API) ✅

### 🔄 Phase en cours

- **Phase 2.6** : Intégration Face B avec système d'invitations

### 📋 Prochaines étapes

- **Phase 3** : Migration des composables et stores métier
- **Phase 4** : Migration des pages et composants
- **Phase 5** : Permissions et optimisations

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests end-to-end
pnpm test:e2e

# Tests en mode watch
pnpm test:watch

# Linting
pnpm lint
```

## 📦 Versioning

Ce projet utilise [Changesets](https://github.com/changesets/changesets) pour le versioning automatique :

```bash
# Créer un changeset pour documenter vos changements
pnpm changeset

# Vérifier les changesets en attente
pnpm version:check
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créer une branche** : `git checkout -b feature/amazing-feature`
3. **Commit** : `git commit -m 'feat: Add amazing feature'`
4. **Créer un changeset** : `pnpm changeset`
5. **Push** : `git push origin feature/amazing-feature`
6. **Créer une Pull Request**

### Convention des commits

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, point-virgules manquants, etc.
- `refactor:` - Refactoring du code
- `test:` - Ajout de tests
- `chore:` - Maintenance (dépendances, config, etc.)

## 📄 Licence

Ce projet est sous licence privée - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- 📧 **Email** : dev@nina.fm
- 🐛 **Issues** : [GitHub Issues](https://github.com/Nina-fm/nina.fm-faceb/issues)
- 📚 **Documentation** : [docs/](docs/)

---

**Fait avec ❤️ par l'équipe Nina.fm**t documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3002`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
