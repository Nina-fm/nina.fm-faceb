# nina.fm-faceb

## 1.0.0

### Major Changes

- d7459ca: 🚀 Version 1.0.0 - Production ready Face B v2

  **Architecture complète Nina.fm API:**
  - Migration totale de Supabase/Prisma vers Nina.fm API
  - Types TypeScript auto-générés depuis Swagger (3379 lignes)
  - Architecture de types stratifiée (generated, bridge, helpers)
  - Script `pnpm generate:types` pour synchronisation

  **Stack technique moderne:**
  - Nuxt 4 avec Composition API
  - TanStack Query (Vue Query) pour data fetching
  - Shadcn-vue + Reka-ui pour les composants
  - vee-validate + Zod pour les formulaires
  - Tailwind CSS 4 avec animations

  **Fonctionnalités complètes:**
  - Authentification cookie-based JWT
  - Gestion complète des Mixtapes (CRUD, upload audio, tracks)
  - Gestion DJs et Tags avec système de permissions
  - Invitations par email (Resend)
  - Interface admin complète avec tables, filtres, formulaires
  - Support drag & drop pour les tracks
  - Validation stricte TypeScript

  **DevOps & Déploiement:**
  - Docker multi-stage optimisé pour production
  - CI/CD GitHub Actions avec versioning automatique
  - Changesets pour gestion sémantique des versions
  - Déploiement parallèle avec Face B v1
  - Configuration nginx pour face-b.nina.fm

  **Migrations et refactoring:**
  - 200+ composants migrés vers les nouveaux types
  - Refactoring complet des composables et stores Pinia
  - Nettoyage des dépendances obsolètes
  - Configuration pnpm workspace
  - ESLint + Prettier avec règles strictes
