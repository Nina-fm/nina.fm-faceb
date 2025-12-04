# nina.fm-faceb

## 1.2.1

### Patch Changes

- b459446: Fix changing password issue

## 1.2.0

### Minor Changes

- 6b21117: SuperTokens authentication integration - Face B admin interface

  **Breaking Changes:**
  - Existing users must reset their passwords after migration (automatic email sent)
  - Legacy JWT authentication deprecated (backward compatible during transition)

  **New Features:**
  - SuperTokens authentication with email/password
  - Invitation system for new admins (email workflow with auto role assignment)
  - FirstName/LastName fields in user profiles
  - Auto-login after signup via invitation
  - Session management with secure cookies

  **User Experience:**
  - Simplified login flow at `/auth/login`
  - Password reset flow at `/auth/reset-password`
  - Invitation acceptance flow at `/auth/accept-invitation`
  - Profile with firstName/lastName display
  - Automatic session persistence across Face B

  **Security:**
  - Cookie-based sessions (domain: .nina.fm)
  - HTTPS-only cookies in production
  - SameSite=lax for CSRF protection
  - Auto-refresh token rotation

  **Technical:**
  - Uses Nina.fm API SuperTokens backend
  - No local SuperTokens configuration required (proxied via API)
  - Already configured with API_URL=https://api.nina.fm in .env.prod

  **Deployment:**
  - No additional GitHub Secrets/Variables required
  - No manual configuration needed (API handles everything)
  - Ready to deploy immediately after API deployment

  Production-ready - No preparation required on Face B side.

## 1.1.1

### Patch Changes

- 725fc5e: Add role badges for all users

## 1.1.0

### Minor Changes

- 3b76242: Add lightbox for cover and avatar on details pages

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
