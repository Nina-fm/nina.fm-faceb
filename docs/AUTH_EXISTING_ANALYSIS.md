# Analyse de l'Existant - Système d'Authentification

## 🔍 Vue d'ensemble

Analyse complète du système d'authentification actuel pour identifier ce qui doit être **nettoyé**, **remplacé** ou **conservé** lors de la migration vers le système cookie-based.

---

## 📊 État actuel - Frontend (Nuxt)

### 1. Store Auth (`stores/auth.ts`)

**Problèmes identifiés** :

#### ❌ Double stockage (localStorage + cookies non-httpOnly)

```typescript
// Ligne 26-29 : localStorage
localStorage.setItem('nina_access_token', newAccessToken)
localStorage.setItem('nina_refresh_token', newRefreshToken)

// Ligne 32-43 : Cookies NON httpOnly
const accessTokenCookie = useCookie('nina_access_token', {
  httpOnly: false, // ❌ VULNÉRABLE
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 15, // 15 minutes
})
```

**Pourquoi c'est problématique** :

- ✗ Tokens accessibles en JavaScript (vulnérable XSS)
- ✗ Duplication localStorage + cookies = incohérence
- ✗ localStorage ne fonctionne pas en SSR
- ✗ Cookie maxAge en secondes incorrectes (devrait être 900, pas 60\*15)

#### ❌ Logique complexe de chargement

```typescript
// Ligne 88-106 : Tentative de chargement depuis localStorage OU cookies
if (import.meta.client) {
  // Côté client : localStorage puis cookies
  storedAccessToken = localStorage.getItem('nina_access_token')
  if (!storedAccessToken) {
    const accessTokenCookie = useCookie('nina_access_token')
    storedAccessToken = accessTokenCookie.value || null
  }
} else {
  // Côté serveur : cookies uniquement
  const accessTokenCookie = useCookie('nina_access_token')
  storedAccessToken = accessTokenCookie.value || null
}
```

**Pourquoi c'est problématique** :

- ✗ Logique trop complexe (fallback localStorage → cookies)
- ✗ Incohérence client/serveur
- ✗ Risque de désynchronisation

#### ❌ Refresh manuel avec $fetch

```typescript
// Ligne 161-189 : Refresh utilise $fetch directement
const response = await $fetch<{ access_token: string; refresh_token: string }>('/auth/refresh', {
  method: 'POST',
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  body: { refresh_token: refreshToken.value },
})
```

**Pourquoi c'est problématique** :

- ✗ Envoie le refresh_token dans le body (pas sécurisé)
- ✗ Court-circuite le système d'API centralisé
- ✗ Pas de retry/error handling cohérent

#### 🔧 À REMPLACER COMPLÈTEMENT

**Actions** :

1. ✅ Supprimer localStorage entièrement
2. ✅ Supprimer gestion manuelle des cookies
3. ✅ Simplifier la logique (cookies httpOnly gérés par l'API)
4. ✅ Conserver uniquement : `user`, `expiresAt`, `isAuthenticated`
5. ✅ Ajouter : timer de refresh proactif

---

### 2. Composable API (`composables/api.ts`)

**Problèmes identifiés** :

#### ⚠️ Intercepteur 401 partiel

```typescript
// Ligne 65-72 : onResponseError
onResponseError(context) {
  if (context.response.status === 401 && !endpoint.includes('/auth/')) {
    console.log('[API] Token expiré détecté')
    authStore.handleTokenExpired()  // ❌ Appel asynchrone non attendu
  }
}
```

**Pourquoi c'est problématique** :

- ✗ `handleTokenExpired()` n'est pas attendu (pas async/await)
- ✗ Pas de retry de la requête originale après refresh
- ✗ Condition simpliste (`!endpoint.includes('/auth/')`)

#### ⚠️ Authorization header manuel

```typescript
// Ligne 48-50 : Ajout manuel du header Authorization
if (requireAuth && authStore.accessToken) {
  requestHeaders.Authorization = `Bearer ${authStore.accessToken}`
}
```

**Pourquoi c'est à modifier** :

- ⚠️ Avec cookies httpOnly, plus besoin de header Authorization
- ⚠️ Mais... utile pour rétro-compatibilité API (fallback)

#### 🔧 À MODIFIER (pas à supprimer)

**Actions** :

1. ✅ Ajouter `credentials: 'include'` pour envoyer cookies
2. ✅ Améliorer intercepteur 401 (async/await + retry)
3. ⚠️ Conserver Authorization header en fallback (phase de transition)
4. ✅ Supprimer référence à `authStore.accessToken` après migration

---

### 3. Composable AuthApi (`composables/authApi.ts`)

**Analyse** :

#### ✅ Logique métier bonne (à conserver)

```typescript
const login = async (email: string, password: string) => {
  const response = await post<{ access_token: string; refresh_token: string }>(...)
  await authStore.setTokens(response.access_token, response.refresh_token)  // ❌ À changer
  await loadUserProfileWithToken(response.access_token)  // ❌ À changer
  await navigateTo('/')
}
```

**Ce qui change** :

- ❌ Supprimer `authStore.setTokens()` (tokens dans cookies httpOnly)
- ✅ Conserver `authStore.setUser()` avec données user de la réponse
- ✅ Conserver `navigateTo('/')`

#### 🔧 À ADAPTER (structure OK, implémentation à modifier)

**Actions** :

1. ✅ Modifier `login()` : stocker user + expiresAt (pas tokens)
2. ✅ Modifier `register()` : idem
3. ✅ Modifier `logout()` : juste clear store + redirect (cookies cleared by API)
4. ✅ Supprimer `loadUserProfileWithToken()` (plus de token côté client)

---

### 4. Plugin Auth (`plugins/0.auth.ts`)

**Problèmes identifiés** :

#### ❌ Initialisation complexe avec watchers

```typescript
// Ligne 14-16 : Chargement au démarrage
await authStore.loadUserProfile()
authInitialized.value = true

// Ligne 92-127 : Watchers multiples pour synchronisation
watch(authInitialized, async (initialized) => { ... })
watch(isLoggedIn, async (loggedIn) => { ... })
```

**Pourquoi c'est problématique** :

- ✗ Race conditions possibles (watchers multiples)
- ✗ `loadUserProfile()` fait un fetch alors que cookies déjà présents
- ✗ Logique de redirection dans le plugin (devrait être dans middleware)

#### ❌ Middleware global dans plugin

```typescript
// Ligne 48-76 : addRouteMiddleware dans plugin
addRouteMiddleware(
  'auth',
  (to) => {
    if (!isLoggedIn.value && toRequireAuth) {
      return '/login'
    }
  },
  { global: true },
)
```

**Pourquoi c'est problématique** :

- ✗ Duplication avec `middleware/auth.global.ts`
- ✗ Conflit possible entre les deux
- ✗ Logique auth éparpillée (plugin + middleware)

#### 🔧 À SIMPLIFIER RADICALEMENT

**Actions** :

1. ✅ Supprimer tout le chargement initial (SSR middleware s'en charge)
2. ✅ Supprimer les watchers (reactive avec composables)
3. ✅ Supprimer addRouteMiddleware (redondant avec auth.global.ts)
4. ⚠️ Conserver uniquement les helpers `hasRole`, `hasAnyRole`
5. ✅ Plugin devient minimal : juste `provide` des helpers

---

### 5. Middleware Auth (`middleware/auth.global.ts`)

**Problèmes identifiés** :

#### ❌ Duplication avec plugin

```typescript
// Ligne 50-56 : Chargement du profil dans middleware
if (!authStore.user || !authStore.accessToken) {
  try {
    await authStore.loadUserProfile()
  } catch (error) { ... }
}
```

**Pourquoi c'est problématique** :

- ✗ `loadUserProfile()` refait un fetch inutile
- ✗ Devrait juste lire le user depuis le store (préchargé en SSR)
- ✗ Logique complexe avec délais et retries (lignes 67-73)

#### ❌ Validation token côté serveur manuelle

```typescript
// Lignes 24-43 : Parsing JWT manuel côté serveur
const tokenPart = accessTokenCookie.value?.split('.')[1]
const payload = JSON.parse(atob(tokenPart))
if (payload.exp && payload.exp < now) { ... }
```

**Pourquoi c'est problématique** :

- ✗ Parsing JWT manuel (fragile)
- ✗ Pas de vérification de signature
- ✗ Cookie non-httpOnly donc pas sécurisé

#### 🔧 À RÉCRIRE COMPLÈTEMENT

**Actions** :

1. ✅ SSR : Utiliser server middleware pour injecter user dans context
2. ✅ Client : Juste vérifier `authStore.isAuthenticated`
3. ✅ Supprimer parsing JWT manuel
4. ✅ Supprimer appels `loadUserProfile()` (déjà fait en SSR)

---

### 6. Server Middleware (MANQUANT !)

**Constat** :

- ❌ Pas de server middleware auth actuellement
- ❌ Server CORS existe (`server/middleware/cors.ts`) mais basique
- ❌ Pas d'injection du user dans event context pour SSR

#### 🆕 À CRÉER

**Actions** :

1. ✅ Créer `server/middleware/auth.ts`
2. ✅ Lire cookies httpOnly côté serveur
3. ✅ Fetch `/auth/profile` avec cookie
4. ✅ Injecter `event.context.user` pour hydration
5. ✅ Gérer refresh si access_token expiré

---

### 7. Configuration Nuxt (`nuxt.config.ts`)

**Analyse** :

#### ⚠️ Pas de proxy configuré

```typescript
runtimeConfig: {
  public: {
    apiUrl: process.env.API_URL || 'http://localhost:4000',
  }
}
```

**Pourquoi c'est à ajouter** :

- ⚠️ En dev, appels cross-origin (localhost:3001 → localhost:4000)
- ⚠️ Cookies cross-origin ne marchent pas bien
- ✅ Solution : Proxy Nuxt (`/api/*` → `localhost:4000`)

#### 🔧 À AJOUTER

**Actions** :

1. ✅ Ajouter `nitro.devProxy` pour `/api/*`
2. ✅ Modifier `apiUrl` en dev : `/api` au lieu de `http://localhost:4000`
3. ✅ Conserver `http://localhost:4000` en prod (ou URL distante)

---

### 8. Utils Session (`server/utils/session.ts`)

**Constat** :

- ❓ Existe mais semble inutilisé
- ❓ Référence `useRuntimeConfig().app.auth` qui n'existe pas
- ❓ `useSession()` de h3 : alternative aux cookies httpOnly ?

#### ❓ À ÉVALUER

**Questions** :

- Est-ce utilisé quelque part ? (grep ne montre rien)
- Est-ce une tentative antérieure d'auth serveur ?
- Faut-il le conserver ou le supprimer ?

**Action recommandée** :

- ✅ Supprimer si inutilisé
- ⚠️ Ou adapter pour le nouveau système ?

---

## 📊 État actuel - Backend (NestJS)

### 1. Auth Controller (`src/auth/auth.controller.ts`)

**Analyse** :

#### ✅ Structure bonne, à adapter pour cookies

```typescript
@Post('login')
async signIn(@Body() signInDto: SignInDto) {
  return this.authService.signIn(signInDto.email, signInDto.password)
}
```

**Ce qui change** :

- ✅ Ajouter `@Res({ passthrough: true }) res: Response`
- ✅ Appeler `CookieHelper.setAccessToken()`, `setRefreshToken()`
- ✅ Retourner `{ user, expiresAt }` au lieu de `{ access_token, refresh_token }`

#### 🔧 À MODIFIER (ajout @Res et cookies)

**Actions pour chaque endpoint** :

| Endpoint              | Modification                                               |
| --------------------- | ---------------------------------------------------------- |
| `POST /auth/login`    | Setter cookies + retourner user                            |
| `POST /auth/register` | Setter cookies + retourner user                            |
| `POST /auth/refresh`  | Lire refresh_token depuis cookie + setter nouveaux cookies |
| `POST /auth/logout`   | Lire access_token depuis cookie + clear cookies            |
| `GET /auth/profile`   | ✅ Déjà OK (lit JWT via strategy)                          |

---

### 2. Auth Service (`src/auth/auth.service.ts`)

**Analyse** :

#### ✅ Logique métier bonne (pas de changement)

```typescript
async signIn(email, pass): Promise<{ access_token, refresh_token }> {
  // Validation credentials
  const tokens = await this.generateTokens(...)
  await this.usersService.updateRefreshToken(userId, tokens.refresh_token)
  return tokens
}
```

**Ce qui reste pareil** :

- ✅ Validation credentials
- ✅ Génération tokens JWT
- ✅ Blacklist access token au logout
- ✅ Refresh token logic

**Ce qui change** :

- ⚠️ Controller définit cookies (pas service)
- ⚠️ Service continue de retourner tokens (pour que controller les mette en cookies)

#### ✅ AUCUN CHANGEMENT NÉCESSAIRE

---

### 3. JWT Strategy (`src/auth/strategies/jwt.strategy.ts`)

**Problème identifié** :

#### ❌ Lit uniquement Authorization header

```typescript
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
```

**Ce qui doit changer** :

- ✅ Ajouter lecture depuis cookie `access_token`
- ✅ Garder Authorization header en fallback (rétro-compatibilité)

#### 🔧 À MODIFIER (ajouter extraction cookie)

**Action** :

```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  (request: Request) => request?.cookies?.['access_token'],
  ExtractJwt.fromAuthHeaderAsBearerToken(),
])
```

---

### 4. Main.ts CORS

**Analyse** :

#### ✅ CORS avec credentials déjà activé !

```typescript
app.enableCors({
  origin: corsOrigins,
  credentials: true, // ✅ Déjà présent !
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
})
```

**Ce qui manque** :

- ❌ `cookie-parser` middleware pas installé
- ❌ Pas de `app.use(cookieParser())`

#### 🔧 À COMPLÉTER

**Actions** :

1. ✅ Installer `cookie-parser` + `@types/cookie-parser`
2. ✅ Ajouter `app.use(cookieParser())` AVANT `.enableCors()`

---

## 📋 Plan de nettoyage / Refactoring

### Phase 0 : Préparation (Backend d'abord)

**Durée** : 1-2h

**API** :

1. ✅ Installer `cookie-parser`
2. ✅ Créer `CookieHelper` class
3. ✅ Modifier `AuthController` (cookies)
4. ✅ Modifier `JwtStrategy` (lecture cookie)
5. ✅ Tester avec Postman/Bruno

**Nuxt** :

1. ✅ Créer `.env.local` avec nouvelles vars
2. ✅ Ajouter proxy dans `nuxt.config.ts`

---

### Phase 1 : Server-Side (Nuxt SSR)

**Durée** : 2h

**Créer** :

1. ✅ `server/middleware/auth.ts` (hydration SSR)

**Modifier** :

1. ✅ `nuxt.config.ts` (proxy dev)

**Tester** :

- Hydration SSR fonctionne
- User disponible au premier render

---

### Phase 2 : Client-Side (Nuxt CSR)

**Durée** : 3h

**Modifier** :

1. ✅ `stores/auth.ts`
   - Supprimer localStorage
   - Supprimer gestion cookies
   - Ajouter timer refresh proactif
   - Simplifier `loadUserProfile()`

2. ✅ `composables/api.ts`
   - Ajouter `credentials: 'include'`
   - Améliorer intercepteur 401 (async + retry)

3. ✅ `composables/authApi.ts`
   - Adapter `login()`, `register()`, `logout()`
   - Supprimer gestion tokens côté client

4. ✅ `middleware/auth.global.ts`
   - Simplifier (juste check `isAuthenticated`)
   - Utiliser user hydraté depuis SSR

5. ✅ `plugins/0.auth.ts`
   - Simplifier radicalement
   - Supprimer watchers et initialisation
   - Garder uniquement `provide` helpers

**Supprimer** :

1. ✅ `server/utils/session.ts` (si inutilisé)

**Tester** :

- Login fonctionne
- Refresh automatique (401)
- Refresh proactif (timer)
- Logout fonctionne
- SSR + CSR cohérents

---

### Phase 3 : Nettoyage final

**Durée** : 1h

**Actions** :

1. ✅ Supprimer tous les `console.log('[AUTH]')`
2. ✅ Supprimer références `accessToken` dans authStore
3. ✅ Supprimer `refreshToken` dans authStore
4. ✅ Vérifier qu'aucun localStorage auth restant
5. ✅ Tester tous les flows end-to-end

---

## 📊 Comparaison Avant/Après (Détaillé)

### Frontend - Fichiers impactés

| Fichier                     | Avant                      | Après                      | Action              |
| --------------------------- | -------------------------- | -------------------------- | ------------------- |
| `stores/auth.ts`            | 250 lignes, complexe       | 100 lignes, simple         | ✂️ Simplifier 60%   |
| `composables/api.ts`        | Intercepteur basique       | Intercepteur async + retry | 🔧 Améliorer        |
| `composables/authApi.ts`    | Gestion tokens             | Gestion user seulement     | ✂️ Simplifier 30%   |
| `middleware/auth.global.ts` | 90 lignes, fetch + parsing | 30 lignes, check simple    | ✂️ Simplifier 70%   |
| `plugins/0.auth.ts`         | 155 lignes, watchers       | 40 lignes, helpers         | ✂️ Simplifier 75%   |
| `server/middleware/auth.ts` | ❌ N'existe pas            | ✅ Nouveau (60 lignes)     | 🆕 Créer            |
| `server/utils/session.ts`   | 30 lignes, inutilisé       | ❌ Supprimé                | 🗑️ Supprimer        |
| `nuxt.config.ts`            | Pas de proxy               | Proxy `/api/*`             | 🔧 Ajouter 5 lignes |

**Total lignes** : **575 → 290** (-50%)

---

### Backend - Fichiers impactés

| Fichier                    | Avant           | Après                     | Action                |
| -------------------------- | --------------- | ------------------------- | --------------------- |
| `auth.controller.ts`       | Return tokens   | Set cookies + return user | 🔧 Modifier 30 lignes |
| `auth.service.ts`          | ✅ Déjà OK      | ✅ Aucun changement       | ✅ Conserver          |
| `jwt.strategy.ts`          | Header only     | Cookie + header           | 🔧 Ajouter 10 lignes  |
| `main.ts`                  | CORS OK         | + cookie-parser           | 🔧 Ajouter 2 lignes   |
| `helpers/cookie.helper.ts` | ❌ N'existe pas | ✅ Nouveau (120 lignes)   | 🆕 Créer              |

**Total lignes** : **+162 lignes** (nouveau helper)

---

## 🎯 Bénéfices attendus

### Sécurité

- ✅ Tokens inaccessibles JavaScript (XSS protection)
- ✅ httpOnly + Secure + SameSite
- ✅ Pas de localStorage (pas de vol de token)

### Performance

- ✅ SSR hydration instantanée (pas de fetch initial)
- ✅ Moins de requêtes (refresh proactif)
- ✅ Pas de waterfall auth (user préchargé)

### Maintenabilité

- ✅ -50% de code frontend auth
- ✅ Logique centralisée (moins de duplication)
- ✅ Moins de bugs (moins de edge cases)

### DX (Developer Experience)

- ✅ Moins de console logs debug
- ✅ Comportement plus prévisible
- ✅ Standard industry (pas de custom logic)

---

## ⚠️ Risques et Mitigation

### Risque 1 : Cookies cross-domain en dev

**Problème** : `localhost:3001` → `localhost:4000` = cookies bloqués

**Solution** : Proxy Nuxt (`/api/*` → `localhost:4000`)

---

### Risque 2 : Perte de session pendant migration

**Problème** : Utilisateurs actuels ont tokens dans localStorage

**Solutions** :

1. ✅ Phase de transition : accepter les 2 systèmes
2. ✅ Migration automatique : lire localStorage → login automatique
3. ✅ Ou forcer re-login (plus simple)

**Recommandation** : Forcer re-login (+ notification)

---

### Risque 3 : HTTPS requis en prod

**Problème** : Secure flag ne marche qu'en HTTPS

**Solution** : Déjà en HTTPS (faceb.nina.fm, api.nina.fm)

---

### Risque 4 : Cookie size limit (4KB)

**Problème** : JWT peut être volumineux

**Solution** :

- Access token JWT typique : ~200-300 bytes
- Refresh token JWT : ~200-300 bytes
- Total : ~600 bytes < 4KB ✅

---

## 🚀 Prêt pour l'implémentation

**Documents à suivre** :

1. ✅ `AUTH_IMPLEMENTATION_PLAN.md` - Plan détaillé
2. ✅ `AUTH_SEQUENCE_IDEAL.md` - Diagrammes de séquence
3. ✅ `AUTH_EXISTING_ANALYSIS.md` - Ce document (analyse existant)

**Question** : Veux-tu qu'on commence l'implémentation maintenant, phase par phase ? On peut commencer par le backend (Phase 0) car c'est le plus simple et ça ne casse rien. 🚀
