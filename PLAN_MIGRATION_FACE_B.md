# 🎯 Plan de Migration Face B vers Architecture API-First

> **Objectif :** Migrer Face B (Nuxt 3) de Supabase/Prisma vers l'API Nina.fm (NestJS) tout en conservant l'UX existante et en homogénéisant l'architecture.

## 📊 **Vue d'Ensemble**

- **Durée estimée :** 10-14 jours
- **Environnements :** Local + Production (staging ultérieurement si besoin)
- **Cache Strategy :** TanStack Query (Vue Query) pour optimiser les performances
- **Migration des données :** Phase séparée après la migration technique
- **Package Manager :** pnpm (homogénéisation avec l'API)
- **Versioning :** Changesets pour changelog automatique
- **Git Strategy :** Commits logiques et réguliers + changelog à chaque étape importante

---

## 🔧 **Phase 1 : Setup et Configuration de Base** _(2-3 jours)_ ✅ **TERMINÉE**

### 1.0 Préparation de l'Environnement ✅ **COMPLÉTÉ**

- [x] **Migration vers pnpm**
  - Supprimer `yarn.lock` et `node_modules/`
  - Créer `pnpm-workspace.yaml` si nécessaire
  - Installer les dépendances avec `pnpm install`
  - Mettre à jour les scripts dans `package.json`
- [x] **Configuration Changesets**
  - Installer `@changesets/cli`
  - Initialiser avec `pnpm changeset init`
  - Configurer les paramètres dans `.changeset/config.json`
- [x] **Commit initial :** Setup pnpm + changesets
- [x] **Changelog :** v1.0.0 - Préparation migration

### 1.1 Nettoyage des Dépendances ✅ **COMPLÉTÉ**

- [x] Supprimer les packages Supabase/Prisma du `package.json`
  - `@nuxtjs/supabase`
  - `@prisma/client`
  - `@prisma/nuxt`
  - `@sidebase/nuxt-auth`
  - `@auth/prisma-adapter`
- [x] Supprimer les fichiers et dossiers associés
  - `prisma/` (schema, migrations)
  - `supabase/`
  - Configurations Supabase dans `nuxt.config.ts`
- [x] Nettoyage des imports et références Prisma dans les composants

### 1.2 Installation des Nouvelles Dépendances ✅ **COMPLÉTÉ**

- [x] Installer TanStack Query : `@tanstack/vue-query`
- [x] Installer utilitaires API : `@vueuse/integrations`
- [x] Configurer les types TypeScript pour l'API

### 1.3 Configuration API Centralisée ✅ **COMPLÉTÉ**

- [x] Créer `composables/api.ts` - Service API central
  - Configuration base URL API
  - Intercepteurs pour auth headers
  - Gestion automatique refresh tokens
  - Types de réponse standardisés
- [x] Variables d'environnement
  - `NUXT_PUBLIC_API_URL` pour l'URL de l'API
  - Configuration pour local/prod
- [x] Configuration TanStack Query dans `plugins/2.vue-query.ts`
- [x] Création des Query Keys standardisées dans `composables/query-keys.ts`
- [x] Suppression complète des APIs serveur obsolètes

### 1.4 Types TypeScript depuis l'API ✅ **TERMINÉ**

- [x] Générer les types depuis Swagger de l'API (3379 lignes auto-générées)
- [x] Architecture 3-fichiers pour types optimisée :
  - `api-generated.d.ts` : Types auto-générés depuis Swagger (NE PAS MODIFIER)
  - `api.d.ts` : Passerelle pour exposition globale des types
  - `api-helpers.d.ts` : Types utilitaires et personnalisés
- [x] Créer `types/api-config.ts` avec endpoints et constantes
- [x] Script `pnpm generate:types` pour synchronisation automatique
- [x] DTOs complets pour toutes les entités (User, Profile, Dj, Mixtape, Tag, Image)

---

## 🔐 **Phase 2 : Migration de l'Authentification** _(4 jours)_ ⏳ **EN COURS** (4/5)

### 2.1 Nouveau Store Auth ✅ **COMPLÉTÉ**

- [x] Refactor complet `stores/auth.ts`
  - Remplacer logique Supabase par endpoints API
  - `POST /auth/login` (corrigé depuis signin)
  - `POST /auth/register` (corrigé depuis signup)
  - `POST /auth/refresh`
  - `GET /auth/profile` (corrigé depuis me)
  - `POST /auth/logout`
- [x] Gestion des tokens JWT
  - Stockage sécurisé (httpOnly cookies + localStorage)
  - Auto-refresh des access tokens
  - Nettoyage lors du logout
- [x] Ajout d'états réactifs améliorés
  - `isLoading` pour les interfaces utilisateur
  - `userRole` et `hasProfile` computed
  - Gestion du loading dans `loadUserProfile()`

### 2.2 Composable Auth API ✅ **COMPLÉTÉ**

- [x] Créer `composables/authApi.ts`
  - Méthodes login/register/logout
  - Gestion du state utilisateur
  - Vérification des permissions/rôles
- [x] Gestion des états de loading
  - Loading states dans toutes les actions auth
  - Gestion robuste des erreurs
  - Auto-login après inscription
- [x] Intégration avec l'architecture API existante

### 2.3 Middleware et Navigation Guards ✅ **TERMINÉE**

- [x] Adapter `middleware/auth.ts`
  - Vérification validité token côté serveur et client
  - Redirection si non authentifié vers `/login`
  - Gestion des permissions par route (`requiresRoles`)
  - Middleware global pour protection automatique
  - Pages publiques avec `auth: false`
- [x] Configuration middleware global (`auth.global.ts`)
- [x] Tests de redirection et accès aux pages protégées

### 2.4 Pages d'Authentification ✅ **TERMINÉE**

- [x] Valider `pages/login.vue`
  - Utilise déjà les nouveaux endpoints API
  - Conserver design actuel
  - Gestion d'erreurs améliorée
- [x] Valider `pages/register.vue`
- [x] Migrer `pages/reset-password.vue` et `pages/set-password.vue`
  - Intégration avec EmailService et Resend
  - Flow complet de réinitialisation par email
  - Gestion des tokens JWT avec expiration
- [x] Tests des flows complets d'authentification

### 2.5 Système d'Invitation ⏳ **EN COURS**

> **🎯 Objectif :** Sécuriser Face B avec un système d'invitation pour contrôler l'accès

**Architecture :**
- **API Nina.fm** : Endpoints flexibles (inscription libre + invitation optionnelle)
- **Face B** : Interface privée avec invitation obligatoire
- **Autres apps futures** : Choix libre entre inscription publique et privée

#### 2.5.1 API - Infrastructure d'Invitation

- [ ] **Table `invitations`** (TypeORM Entity)
  - `id` : UUID
  - `email` : String (destinataire)
  - `token` : String (JWT avec expiration 7 jours)
  - `used_at` : Date nullable (quand l'invitation est utilisée)
  - `expires_at` : Date (expiration du token)
  - `invited_by` : Relation vers User (administrateur invitant)
  - `created_at` / `updated_at` : Timestamps
  
- [ ] **Migration TypeORM** : Créer la table invitations
  
- [ ] **Endpoints API** (`/invitations`)
  - `POST /invitations/send` (Rôle: ADMIN) - Envoyer une invitation
  - `GET /invitations` (Rôle: ADMIN) - Lister les invitations
  - `GET /invitations/validate/:token` (Public) - Vérifier validité token
  - `DELETE /invitations/:id` (Rôle: ADMIN) - Annuler invitation
  
- [ ] **EmailService enrichi**
  - Template professionnel pour email d'invitation
  - Lien vers `/register?token=xxx` avec branding Nina.fm
  
- [ ] **Auth Register adapté**
  - Paramètre `invitationToken` optionnel dans RegisterDto
  - Validation et consommation du token si fourni
  - Compatibilité avec inscription libre (autres apps)

#### 2.5.2 Face B - Interface Privée

- [ ] **Protection page register**
  - Middleware check token d'invitation obligatoire
  - Redirection vers `/login` si pas de token valide
  - Message informatif sur l'accès par invitation
  
- [ ] **Page gestion invitations** (`/invitations`)
  - Liste des invitations (envoyées, utilisées, expirées)
  - Formulaire envoi nouvelle invitation
  - Actions : annuler, renvoyer
  - Rôle requis : ADMIN
  
- [ ] **Composables d'invitation**
  - `composables/invitationApi.ts` : CRUD invitations
  - Intégration TanStack Query
  - Gestion d'erreurs et loading states

#### 2.5.3 UX et Flow Utilisateur

- [ ] **Email d'invitation professionnel**
  - Template HTML avec branding Nina.fm
  - Bouton CTA vers page register
  - Informations sur l'expiration (7 jours)
  
- [ ] **Page register avec token**
  - Pre-remplissage email si dans token
  - Message de bienvenue personnalisé
  - Feedback sur succès création compte
  
- [ ] **Tests end-to-end**
  - Flow complet admin → invitation → création compte
  - Gestion des tokens expirés/invalides
  - Interface admin fonctionnelle

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

## � **Bonnes Pratiques et Méthodologie**

### Git & Versioning

- **Package Manager :** pnpm exclusivement (alignement avec l'API)
- **Commits :** Réguliers et logiques, messages explicites en français
- **Changesets :** Génération automatique du changelog à chaque étape importante
- **Branches :** Travail sur `main` avec commits atomiques
- **Validation :** Attendre validation avant choix techniques importants

### Points de Changelog

- ✅ **Fin de Phase 1 :** Setup technique et nettoyage
- ✅ **Fin de Phase 2 :** Migration authentification
- ✅ **Fin de Phase 3 :** Migration composables et stores
- ✅ **Fin de Phase 4 :** Migration pages et composants
- ✅ **Fin de Phase 6 :** Dockerisation et déploiement
- ✅ **Fin de Phase 7 :** Validation complète

---

## �📈 **Critères de Succès**

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

## 📈 **État d'Avancement Actuel**

**Date de dernière mise à jour :** 22 juillet 2025

### ✅ **Phases Terminées**

- **Phase 1.0** : Préparation de l'environnement (pnpm + changesets)
- **Phase 1.1** : Nettoyage des dépendances Supabase/Prisma
- **Phase 1.2** : Installation nouvelles dépendances (TanStack Query, VueUse)
- **Phase 1.3** : Configuration API centralisée complète
- **Phase 1.4** : Types TypeScript depuis l'API (génération automatisée complète)
- **Phase 2.1** : Refactor complet du store d'authentification
- **Phase 2.2** : Composable authApi avec gestion états et erreurs

### 🔄 **Phase en Cours**

- **Phase 2.3 : Middleware et Navigation Guards** (prête à commencer)

### 📋 **Prochaines Étapes**

1. **Tests utilisateur de l'authentification actuelle** (en cours)
2. **Phase 2.3 : Middleware auth** (après validation)
3. **Phase 2.4 : Validation pages auth** (après middleware)
4. **Commit et changelog Phase 2** (fin de phase)

### 🎯 **Progression Globale**

- **Phase 1 Setup :** ✅ 100% complété
- **Phase 2 Auth :** 🔄 65% complété (2.1 + 2.2 terminées)
- **Migration globale :** ~45% complété
- **Commit History :** Commits organisés + amendements propres

### 🏗️ **Architecture Actuelle**

- ✅ Service API centralisé (`useApi()`)
- ✅ TanStack Query configuré
- ✅ Types TypeScript complets (3379 lignes auto-générées)
- ✅ Architecture 3-fichiers optimisée (généré + global + utilitaires)
- ✅ Script de synchronisation automatique
- ✅ Query Keys standardisées
- ✅ Configuration environnement
- ✅ **Store auth optimisé** avec states loading
- ✅ **Composable authApi robuste** avec gestion erreurs
- ✅ **Endpoints auth fonctionnels** (login/register/profile/refresh/logout)
- ✅ Build fonctionnel et testé

### 📝 **Notes de Développement**

- ✅ Commits organisés avec --amend pour garder l'historique propre
- ✅ Endpoints auth testés avec credentials root (120@nina.fm)
- ✅ Store auth : loading states, userRole, hasProfile computed
- ✅ AuthApi : gestion loading dans login/logout/register
- ✅ Correction automatique erreurs Prettier/ESLint
- ✅ **Phase 2.1 et 2.2 complètement terminées** - Ready pour middleware

### 📊 **Commits & Releases Actuels**

**Face B (nina.fm-faceb-v2) :**

- `b9dc749` - feat(auth): amélioration store auth et composables (Phase 2.1-2.2)
- `fe80130` - style: formatage et optimisation des composants
- `2a526bd` - feat: migration des pages vers l'API Nina.fm
- `ee75f91` - refactor: adaptation à la nouvelle architecture API
- `48ba485` - chore: mise à jour des configurations projet
- `484a364` - feat(types): optimise l'architecture des types API

**API (nina.fm-api) :**

- Endpoints auth opérationnels (login, register, profile, refresh, logout)
- Tests validés avec credentials root

---

_Dernière mise à jour : 22 juillet 2025_
