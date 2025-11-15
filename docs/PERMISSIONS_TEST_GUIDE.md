# Guide de Test - Système de Permissions

## 🎯 Objectif

Valider que le système de permissions fonctionne correctement pour contrôler l'accès aux pages et aux actions selon les rôles utilisateur.

## 🔐 Rôles et Hiérarchie

```
VIEWER < CONTRIBUTOR < MANAGER < ADMIN
```

- **VIEWER** : Lecture seule
- **CONTRIBUTOR** : Lecture + Upload d'images
- **MANAGER** : Lecture + Upload + Gestion des mixtapes/DJs/tags
- **ADMIN** : Tous les droits + Gestion des utilisateurs

## ✅ Tests à Effectuer

### 1. Protection des Pages (via `definePageMeta`)

#### Test avec rôle VIEWER

- [ ] Tenter d'accéder à `/mixtapes` → ❌ Devrait rediriger vers `/`
- [ ] Tenter d'accéder à `/djs` → ❌ Devrait rediriger vers `/`
- [ ] Tenter d'accéder à `/tags` → ❌ Devrait rediriger vers `/`
- [ ] Tenter d'accéder à `/users` → ❌ Devrait rediriger vers `/`
- [ ] Console devrait afficher: `Accès refusé à /mixtapes: rôle requis ADMIN ou MANAGER, rôle actuel: VIEWER`

#### Test avec rôle MANAGER

- [ ] Accéder à `/mixtapes` → ✅ Devrait fonctionner
- [ ] Accéder à `/djs` → ✅ Devrait fonctionner
- [ ] Accéder à `/tags` → ✅ Devrait fonctionner
- [ ] Tenter d'accéder à `/users` → ❌ Devrait rediriger vers `/` (réservé ADMIN)

#### Test avec rôle ADMIN

- [ ] Accéder à toutes les pages → ✅ Devrait fonctionner partout

### 2. Permissions Granulaires dans l'UI

#### Page `/mixtapes` - Bouton "Créer une mixtape"

**Test VIEWER/CONTRIBUTOR:**

- [ ] Le bouton `+` (créer mixtape) ne devrait PAS être visible

**Test MANAGER/ADMIN:**

- [ ] Le bouton `+` (créer mixtape) devrait être visible
- [ ] Cliquer sur le bouton → Navigation vers `/mixtapes/add`

#### Table des Mixtapes - Actions Modifier/Supprimer

**Test VIEWER/CONTRIBUTOR:**

- [ ] Les boutons "Modifier" (crayon) et "Supprimer" (poubelle) ne devraient PAS être visibles dans la colonne Actions

**Test MANAGER/ADMIN:**

- [ ] Les boutons "Modifier" et "Supprimer" devraient être visibles
- [ ] Cliquer sur "Modifier" → Navigation vers `/mixtapes/{id}/edit`
- [ ] Cliquer sur "Supprimer" → Ouverture du dialogue de confirmation

### 3. Protection des Routes Protégées

**Test non-authentifié:**

- [ ] Tenter d'accéder à `/mixtapes` → ❌ Redirection vers `/login`
- [ ] Tenter d'accéder à `/profile` → ❌ Redirection vers `/login`

**Test authentifié:**

- [ ] Accéder à `/login` → ✅ Redirection vers `/` (déjà connecté)
- [ ] Accéder à `/register` → ✅ Redirection vers `/` (déjà connecté)

## 🛠️ Comment Tester

### Créer des utilisateurs de test (via API ou Bruno)

```bash
# VIEWER
POST /auth/register
{
  "email": "viewer@test.com",
  "password": "Test1234!",
  "role": "VIEWER"
}

# CONTRIBUTOR
POST /auth/register
{
  "email": "contributor@test.com",
  "password": "Test1234!",
  "role": "CONTRIBUTOR"
}

# MANAGER
POST /auth/register
{
  "email": "manager@test.com",
  "password": "Test1234!",
  "role": "MANAGER"
}
```

### Séquence de Test

1. **Se connecter avec VIEWER**
   - Vérifier les pages inaccessibles
   - Vérifier les boutons masqués
   - Vérifier les messages console

2. **Se déconnecter et se connecter avec MANAGER**
   - Vérifier les pages accessibles
   - Vérifier les boutons visibles
   - Tester les actions (créer, modifier, supprimer)

3. **Se déconnecter et se connecter avec ADMIN**
   - Vérifier l'accès à `/users`
   - Vérifier toutes les permissions

## 📋 Résultats Attendus

### Permissions Implémentées

- ✅ Protection des pages via middleware `auth.global.ts`
- ✅ Vérification des rôles via `definePageMeta({ roles: [...] })`
- ✅ Conditionnement du bouton "Créer mixtape" (MANAGER+)
- ✅ Conditionnement des boutons Modifier/Supprimer dans la table (MANAGER+)
- ✅ Messages console pour debug des refus d'accès

### Composables Disponibles

- `usePermissions()` : Permissions granulaires
  - `canManageMixtapes` → ADMIN ou MANAGER
  - `canManageDJs` → ADMIN ou MANAGER
  - `canManageTags` → ADMIN ou MANAGER
  - `canManageUsers` → ADMIN uniquement
  - `canUploadImages` → ADMIN, MANAGER ou CONTRIBUTOR
  - `canViewBackoffice` → ADMIN, MANAGER ou CONTRIBUTOR

- `useRoles()` : Utilitaires de rôles
  - `hasRole(userRole, requiredRole)` : Vérification hiérarchique
  - `hasAnyRole(userRole, requiredRoles[])` : Vérification multiple

## 🐛 Points d'Attention

- Les permissions sont **hiérarchiques** : ADMIN > MANAGER > CONTRIBUTOR > VIEWER
- Un MANAGER peut faire tout ce qu'un CONTRIBUTOR peut faire
- Les redirections se font vers `/` (page d'accueil)
- Les messages de refus s'affichent dans la console (mode dev)
- En production, considérer l'utilisation de toasts pour feedback utilisateur

## 🚀 Prochaines Étapes

- [ ] Ajouter des toasts pour feedback utilisateur lors des refus
- [ ] Appliquer les permissions sur `/djs`, `/tags`, `/users`
- [ ] Tester avec Playwright/Cypress (tests E2E)
- [ ] Documenter les permissions dans le README
