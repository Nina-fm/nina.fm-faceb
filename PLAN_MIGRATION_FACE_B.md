# 🎯 Plan de Migration Face B vers Architecture API-First

> **Objectif :** Migrer Face B (Nuxt 3) de Supabase/Prisma vers l'API Nina.fm (NestJS) tout en conservant l'UX existante et en homogénéisant l'architecture.

## 📊 **Vue d'Ensemble**

- **Durée estimée :** 10-14 jours
- **Environnements :** Local + Production (staging ultérieurement si besoin)
- **Cache Strategy :** TanStack Query (Vue Query) pour optimiser les performances
- **Migration des données :** Phase séparée après la migration technique

---

## 🔧 **Phase 1 : Setup et Configuration de Base** _(2-3 jours)_

### 1.1 Nettoyage des Dépendances

- [ ] Supprimer les packages Supabase/Prisma du `package.json`
  - `@nuxtjs/supabase`
  - `@prisma/client`
  - `@prisma/nuxt`
  - `@sidebase/nuxt-auth`
  - `@auth/prisma-adapter`
- [ ] Supprimer les fichiers et dossiers associés
  - `prisma/` (schema, migrations)
  - `supabase/`
  - Configurations Supabase dans `nuxt.config.ts`

### 1.2 Installation des Nouvelles Dépendances

- [ ] Installer TanStack Query : `@tanstack/vue-query`
- [ ] Installer utilitaires API : `@vueuse/integrations` (si pas déjà présent)
- [ ] Configurer les types TypeScript pour l'API

### 1.3 Configuration API Centralisée

- [ ] Créer `composables/api.ts` - Service API central
  - Configuration base URL API
  - Intercepteurs pour auth headers
  - Gestion automatique refresh tokens
  - Types de réponse standardisés
- [ ] Variables d'environnement
  - `NUXT_PUBLIC_API_URL` pour l'URL de l'API
  - Configuration pour local/prod
- [ ] Configuration TanStack Query dans `plugins/`

### 1.4 Types TypeScript depuis l'API

- [ ] Générer les types depuis Swagger de l'API
- [ ] Créer `types/api.ts` avec toutes les interfaces
- [ ] DTOs pour les requêtes/réponses

---

## 🔐 **Phase 2 : Migration de l'Authentification** _(3 jours)_

### 2.1 Nouveau Store Auth

- [ ] Refactor complet `stores/auth.ts`
  - Remplacer logique Supabase par endpoints API
  - `POST /auth/login`
  - `POST /auth/register`
  - `POST /auth/refresh`
  - `GET /auth/profile`
  - `POST /auth/logout`
- [ ] Gestion des tokens JWT
  - Stockage sécurisé (httpOnly cookies ou localStorage)
  - Auto-refresh des access tokens
  - Nettoyage lors du logout

### 2.2 Composable Auth API

- [ ] Créer `composables/authApi.ts`
  - Méthodes login/register/logout
  - Gestion du state utilisateur
  - Vérification des permissions/rôles
- [ ] Intégration avec TanStack Query pour la gestion du cache utilisateur

### 2.3 Middleware et Navigation Guards

- [ ] Adapter `middleware/auth.ts`
  - Vérification validité token
  - Redirection si non authentifié
  - Gestion des permissions par route
- [ ] Adapter les composants de navigation selon les rôles

### 2.4 Pages d'Authentification

- [ ] Migrer `pages/login.vue`
  - Utiliser nouveaux endpoints API
  - Conserver design actuel
  - Gestion d'erreurs améliorée
- [ ] Migrer `pages/register.vue`
- [ ] Migrer `pages/reset-password.vue` et `pages/set-password.vue`
- [ ] Tests des flows complets d'authentification

---

## 📊 **Phase 3 : Migration des Composables et Stores Métier** _(3-4 jours)_

### 3.1 Composables API Spécialisés

- [ ] `composables/userApi.ts`
  - CRUD utilisateurs via `/users/*`
  - Gestion des profils
  - Upload d'avatars
- [ ] `composables/mixtapeApi.ts`
  - CRUD mixtapes via `/mixtapes/*`
  - Gestion des covers
  - Association tags/DJs
- [ ] `composables/djApi.ts`
  - CRUD DJs via `/djs/*`
  - Recherche et filtrage
- [ ] `composables/tagApi.ts`
  - CRUD tags via `/tags/*`
  - Auto-complétion
- [ ] `composables/imageApi.ts`
  - Upload via `/images/*`
  - Génération URLs publiques

### 3.2 Migration des Stores Pinia

- [ ] Refactor `stores/users.ts`
  - Remplacer requêtes Prisma par composables API
  - Adapter structure données selon DTOs API
  - Intégrer TanStack Query
- [ ] Refactor autres stores (mixtapes, djs, tags, etc.)
- [ ] Conserver la logique métier existante
- [ ] Tests unitaires des stores

### 3.3 Gestion des Images

- [ ] Adapter le système d'upload existant
  - Utiliser endpoints API `/images/*`
  - Conserver l'UX actuelle
  - Optimisation et prévisualisation

---

## 🎨 **Phase 4 : Migration des Pages et Composants** _(3-4 jours)_

> **🎯 Focus :** Exploiter pleinement la pagination, filtres et recherche de l'API

### 4.1 Pages de Gestion Utilisateurs

- [ ] Migrer `pages/users/index.vue`
  - **Pagination** : Intégrer la pagination API (page, limit, total)
  - **Filtres avancés** : Rôle, statut du profil, dates de création
  - **Recherche** : Par email, nom, etc.
  - **Tri** : Par colonnes (créé le, email, rôle)
- [ ] Migrer `pages/users/[id].vue`
- [ ] Migrer composants `components/users/*`
- [ ] **Composants réutilisables** :
  - `DataTable.vue` avec pagination
  - `FilterBar.vue` pour les filtres
  - `SearchInput.vue` avec debounce
- [ ] Tests fonctionnels

### 4.2 Pages de Gestion Mixtapes

- [ ] Migrer `pages/mixtapes/index.vue`
  - **Pagination** : Support des grandes listes de mixtapes
  - **Filtres** : Par tags, année, DJs, statut
  - **Recherche** : Nom, description, DJs
  - **Tri** : Date création, nom, année
- [ ] Migrer `pages/mixtapes/[id].vue`
- [ ] Migrer `pages/mixtapes/create.vue`
- [ ] Migrer composants `components/mixtapes/*`

### 4.3 Pages de Gestion DJs et Tags

- [ ] Migrer `pages/djs/*`
  - **Pagination et filtres** pour les DJs
  - **Recherche** par nom, slug
- [ ] Migrer `pages/tags/*`
  - **Gestion des couleurs** et métadonnées
  - **Statistiques** d'utilisation des tags
- [ ] Migrer composants associés

### 4.4 ~~Système d'Invitations~~ _(Feature supplémentaire - Phase 9)_

> **📌 Note :** Le système d'invitations sera traité comme une feature complète supplémentaire après la migration principale (voir Phase 9)

---

## 🛡️ **Phase 5 : Permissions et Optimisations** _(2 jours)_

### 5.1 Système de Permissions

- [ ] Composable `usePermissions()`
  - Vérification des rôles utilisateur
  - Permissions granulaires par action
  - Messages d'erreur contextuels
- [ ] Conditionnement UI selon permissions
  - Boutons d'actions
  - Menus et navigation
  - Affichage des données sensibles

### 5.2 Optimisations UX

- [ ] Loading states avec TanStack Query
- [ ] Optimistic updates pour les actions rapides
- [ ] Gestion d'erreurs unifiée et user-friendly
- [ ] Toasts/notifications cohérentes
- [ ] Pagination et scroll infini si pertinent

### 5.3 Performance et Cache

- [ ] Configuration fine TanStack Query
  - Durées de cache par type de donnée
  - Stratégies de refetch
  - Background updates
- [ ] Optimisation des requêtes API
- [ ] Lazy loading des composants lourds

---

## 🐳 **Phase 6 : Dockerisation et Déploiement** _(2 jours)_

### 6.1 Configuration Docker

- [ ] Créer `Dockerfile` optimisé pour Face B
  - Multi-stage build (build + nginx)
  - Variables d'environnement runtime
  - Optimisation de la taille d'image
- [ ] Créer `docker-compose.yml` pour développement local
- [ ] Scripts de build et test

### 6.2 CI/CD GitHub Actions

- [ ] Workflow de build et test
- [ ] Build et push de l'image Docker
- [ ] Déploiement automatique sur Digital Ocean
- [ ] Variables d'environnement sécurisées (secrets)
- [ ] Monitoring et rollback si nécessaire

### 6.3 Configuration Production

- [ ] Reverse proxy et SSL
- [ ] Variables d'environnement production
- [ ] Monitoring et logs
- [ ] Tests de déploiement

---

## 📋 **Phase 7 : Tests et Validation** _(1-2 jours)_

### 7.1 Tests Fonctionnels

- [ ] Tests E2E des flows critiques
  - Authentification complète
  - CRUD principal (users, mixtapes)
  - Permissions et sécurité
- [ ] Tests de régression UX
- [ ] Performance et temps de chargement

### 7.2 Validation Métier

- [ ] Tests avec données réelles (sandbox)
- [ ] Validation des permissions par rôle
- [ ] Tests de charge basiques
- [ ] Documentation utilisateur mise à jour

---

## 🔄 **Phase 8 : Migration des Données (Post-Migration)**

> **Note :** Cette phase sera planifiée séparément après validation de la migration technique

- [ ] Audit des données existantes Supabase
- [ ] Scripts de migration vers API/PostgreSQL
- [ ] Tests de migration sur environnement dédié
- [ ] Migration production avec backup
- [ ] Validation post-migration

---

## ✨ **Phase 9 : Features Supplémentaires** _(Post-Migration)_

> **Note :** Cette phase ajoute les features qui n'étaient pas présentes dans l'API initiale

### 9.1 Système d'Invitations Complet

- [ ] **Côté API (NestJS) :**

  - Créer module `invitations` complet
  - Entités et DTOs pour les invitations
  - `POST /invitations` - Créer une invitation
  - `GET /invitations` - Lister les invitations (avec pagination)
  - `GET /invitations/:token` - Vérifier une invitation
  - `POST /invitations/:token/accept` - Accepter une invitation
  - `DELETE /invitations/:id` - Supprimer une invitation
  - Permissions et rôles pour les invitations
  - Tests unitaires et E2E

- [ ] **Côté Face B (Nuxt) :**
  - Créer `composables/invitationApi.ts`
  - Migrer/créer `pages/invitations/*`
  - Intégrer dans le flow d'inscription
  - Notifications et emails d'invitation
  - Tests fonctionnels complets

### 9.2 Bibliothèque d'Images (Media Library)

> **💡 Feature :** Gestionnaire centralisé des médias pour le backoffice

- [ ] **Côté API (si nécessaire) :**

  - Étendre endpoints `/images/*` avec métadonnées
  - Ajout de tags/catégories pour les images
  - Recherche et filtrage avancés
  - Gestion des formats et tailles multiples

- [ ] **Côté Face B :**
  - Page `pages/media/index.vue` - Bibliothèque complète
  - **Vue en grille** avec prévisualisations
  - **Filtres** : Type, taille, date, utilisation
  - **Recherche** par nom, tags, métadonnées
  - **Sélecteur d'images** réutilisable pour covers/avatars
  - **Upload en masse** avec drag & drop
  - **Gestion des doublons** et optimisation
  - **Statistiques** : Espace utilisé, images non utilisées

### 9.3 Autres Features Potentielles

- [ ] **Notifications système** (si besoin)
- [ ] **Audit logs** pour les actions sensibles
- [ ] **Export/Import** de données (CSV, JSON)
- [ ] **Statistiques et analytics** du backoffice
- [ ] **Mode sombre/clair** pour l'interface
- [ ] **Raccourcis clavier** pour les power users

---

## 📈 **Critères de Succès**

### Techniques

- ✅ Suppression complète de Supabase/Prisma
- ✅ Authentification 100% via API JWT
- ✅ Toutes les fonctionnalités métier opérationnelles
- ✅ Performances maintenues ou améliorées
- ✅ Déploiement automatisé fonctionnel

### Fonctionnels

- ✅ UX identique ou améliorée
- ✅ Permissions et sécurité respectées
- ✅ Aucune perte de fonctionnalité
- ✅ Stabilité et fiabilité maintenues

---

## 🚨 **Points d'Attention**

1. **Tokens JWT :** Bien gérer l'expiration et le refresh automatique
2. **Permissions :** Tester tous les cas edge selon les rôles
3. **Images :** S'assurer de la compatibilité des formats et tailles
4. **Performance :** Monitoring des temps de réponse API
5. **Rollback :** Plan de retour en arrière si problème critique

---

## 🛠️ **Outils et Resources**

- **API Documentation :** Swagger de l'API Nina.fm
- **State Management :** Pinia + TanStack Query
- **Type Safety :** Types générés depuis API
- **Testing :** Vitest + Cypress pour E2E
- **Monitoring :** Console logs + Sentry si besoin

---

_Dernière mise à jour : 21 juillet 2025_
