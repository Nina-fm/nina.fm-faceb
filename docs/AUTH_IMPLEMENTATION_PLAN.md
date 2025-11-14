# Plan d'Implémentation - Authentification Cookie-based (Nuxt 4 SSR)

## 📋 Vue d'ensemble

Migration du système d'authentification actuel vers une architecture sécurisée basée sur des cookies httpOnly, optimisée pour le SSR Nuxt 4.

**Décisions validées** :

- ✅ Cookies httpOnly uniquement (pas de localStorage)
- ✅ Access token 30min, Refresh token 7 jours (configurable)
- ✅ Domain `.nina.fm` pour partage entre sous-domaines
- ✅ SameSite `lax`
- ✅ Refresh proactif (timer) + réactif (401)
- ✅ Proxy Nuxt en dev local

---

## 🎯 Phases d'implémentation

### Phase 1 : Configuration et préparation (1-2h)

### Phase 2 : Modifications API (2-3h)

### Phase 3 : Modifications Nuxt (3-4h)

### Phase 4 : Tests et ajustements (2h)

### Phase 5 : Déploiement (1h)

**Durée totale estimée** : 9-12h

---

## Phase 1 : Configuration et préparation

### 1.1 Variables d'environnement API

**Fichier** : `/Users/vincent/Sites/nina/nina.fm-api/.env`

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRY=30m
JWT_REFRESH_TOKEN_EXPIRY=7d

# Cookie Configuration
COOKIE_DOMAIN=.nina.fm
COOKIE_SECURE=true
NODE_ENV=production

# Frontend URL (pour CORS)
FRONTEND_URL=https://faceb.nina.fm
```

**Fichier dev** : `/Users/vincent/Sites/nina/nina.fm-api/.env.local`

```env
JWT_SECRET=dev-secret-key-not-for-production
JWT_ACCESS_TOKEN_EXPIRY=30m
JWT_REFRESH_TOKEN_EXPIRY=7d

COOKIE_DOMAIN=
COOKIE_SECURE=false
NODE_ENV=development

FRONTEND_URL=http://localhost:3001
```

### 1.2 Variables d'environnement Nuxt

**Fichier** : `/Users/vincent/Sites/nina/nina.fm-faceb-v2/.env`

```env
# API Configuration
NUXT_PUBLIC_API_URL=https://api.nina.fm
NUXT_PUBLIC_ACCESS_TOKEN_EXPIRY=1800000  # 30min en ms
```

**Fichier dev** : `/Users/vincent/Sites/nina/nina.fm-faceb-v2/.env.local`

```env
# Development - utilise le proxy
NUXT_PUBLIC_API_URL=/api
NUXT_PUBLIC_ACCESS_TOKEN_EXPIRY=1800000
```

### 1.3 Dépendances

**API** : Aucune nouvelle dépendance nécessaire (NestJS inclut tout)

**Nuxt** : Vérifier que ces packages sont installés

```bash
cd /Users/vincent/Sites/nina/nina.fm-faceb-v2
pnpm list cookie-es h3
# Si absents, déjà inclus dans Nuxt 4
```

---

## Phase 2 : Modifications API (NestJS)

### 2.1 Helper pour cookies

**Créer** : `src/auth/helpers/cookie.helper.ts`

```typescript
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

export interface CookieOptions {
  httpOnly: boolean
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  path?: string
  maxAge?: number
  domain?: string
}

export class CookieHelper {
  static getOptions(configService: ConfigService): CookieOptions {
    const isProduction = configService.get('NODE_ENV') === 'production'
    const domain = configService.get('COOKIE_DOMAIN')

    return {
      httpOnly: true,
      secure: configService.get('COOKIE_SECURE') === 'true' || isProduction,
      sameSite: 'lax',
      domain: domain || undefined, // undefined = default behavior
    }
  }

  static setAccessToken(res: Response, token: string, configService: ConfigService) {
    const options = this.getOptions(configService)
    const expiryMs = this.parseExpiry(configService.get('JWT_ACCESS_TOKEN_EXPIRY', '30m'))

    res.cookie('access_token', token, {
      ...options,
      path: '/',
      maxAge: expiryMs,
    })
  }

  static setRefreshToken(res: Response, token: string, configService: ConfigService) {
    const options = this.getOptions(configService)
    const expiryMs = this.parseExpiry(configService.get('JWT_REFRESH_TOKEN_EXPIRY', '7d'))

    res.cookie('refresh_token', token, {
      ...options,
      path: '/',
      maxAge: expiryMs,
    })
  }

  static clearTokens(res: Response, configService: ConfigService) {
    const options = this.getOptions(configService)

    res.clearCookie('access_token', { ...options, path: '/' })
    res.clearCookie('refresh_token', { ...options, path: '/' })
  }

  private static parseExpiry(expiry: string): number {
    // Parse '30m', '7d', etc.
    const match = expiry.match(/^(\d+)([smhd])$/)
    if (!match) return 30 * 60 * 1000 // default 30min

    const value = parseInt(match[1])
    const unit = match[2]

    const multipliers = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    }

    return value * multipliers[unit]
  }

  static getExpiresAt(configService: ConfigService): number {
    const expiryMs = this.parseExpiry(configService.get('JWT_ACCESS_TOKEN_EXPIRY', '30m'))
    return Date.now() + expiryMs
  }
}
```

### 2.2 Modifier AuthController

**Fichier** : `src/auth/auth.controller.ts`

```typescript
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { User } from '../users/entities/user.entity'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { CookieHelper } from './helpers/cookie.helper'
import { RequestWithUser } from './interfaces/request-with-user.interface'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Returns user data and sets auth cookies',
  })
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signIn(signInDto.email, signInDto.password)

    // Set cookies
    CookieHelper.setAccessToken(res, result.access_token, this.configService)
    CookieHelper.setRefreshToken(res, result.refresh_token, this.configService)

    // Return user data (tokens are in cookies)
    return {
      user: result.user,
      expiresAt: CookieHelper.getExpiresAt(this.configService),
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 200,
    description: 'Returns user data and sets auth cookies',
  })
  async signUp(@Body() signUpDto: SignUpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signUp(signUpDto.email, signUpDto.password)

    // Set cookies
    CookieHelper.setAccessToken(res, result.access_token, this.configService)
    CookieHelper.setRefreshToken(res, result.refresh_token, this.configService)

    return {
      user: result.user,
      expiresAt: CookieHelper.getExpiresAt(this.configService),
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Returns new tokens in cookies',
  })
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token']

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token')
    }

    const result = await this.authService.refreshTokens(refreshToken)

    // Set new cookies
    CookieHelper.setAccessToken(res, result.access_token, this.configService)
    CookieHelper.setRefreshToken(res, result.refresh_token, this.configService)

    return {
      user: result.user,
      expiresAt: CookieHelper.getExpiresAt(this.configService),
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async signOut(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const accessToken = req.cookies?.['access_token']

    if (accessToken && req.user) {
      await this.authService.signOut(req.user.sub, accessToken)
    }

    // Clear cookies
    CookieHelper.clearTokens(res, this.configService)

    return { message: 'Logged out successfully' }
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    type: User,
  })
  async getProfile(@Req() req: RequestWithUser) {
    return await this.authService.getProfile(req.user.sub)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent if account exists',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto.email)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password)
  }
}
```

### 2.3 Modifier JWT Strategy pour lire les cookies

**Fichier** : `src/auth/strategies/jwt.strategy.ts`

```typescript
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Priority 1: Cookie
        (request: Request) => {
          return request?.cookies?.['access_token']
        },
        // Priority 2: Authorization header (fallback pour compatibilité)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email, role: payload.role }
  }
}
```

### 2.4 Configurer CORS pour cookies

**Fichier** : `src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Cookie parser AVANT CORS
  app.use(cookieParser())

  // CORS avec credentials
  const frontendUrl = configService.get('FRONTEND_URL')
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:3001', // Dev
    ].filter(Boolean),
    credentials: true, // CRUCIAL pour cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })

  // ... reste de la config
  await app.listen(3000)
}
bootstrap()
```

### 2.5 Installer cookie-parser

```bash
cd /Users/vincent/Sites/nina/nina.fm-api
pnpm add cookie-parser
pnpm add -D @types/cookie-parser
```

---

## Phase 3 : Modifications Nuxt

### 3.1 Configuration Nuxt avec proxy

**Fichier** : `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '/api',
      accessTokenExpiry: process.env.NUXT_PUBLIC_ACCESS_TOKEN_EXPIRY || 1800000,
    },
  },

  // Proxy en dev pour éviter CORS
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        prependPath: true,
      },
    },
  },

  // ... reste de la config
})
```

### 3.2 Server middleware pour SSR auth

**Créer** : `server/middleware/auth.ts`

```typescript
import { getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = getRequestURL(event)

  // Skip for API routes, static files, and public routes
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register')
  ) {
    return
  }

  const accessToken = getCookie(event, 'access_token')
  const refreshToken = getCookie(event, 'refresh_token')

  if (!accessToken && !refreshToken) {
    // No auth, anonymous access
    return
  }

  try {
    // Try to get user profile with access token
    const user = await $fetch('/auth/profile', {
      baseURL: process.env.NODE_ENV === 'production' ? config.public.apiUrl : 'http://localhost:3000',
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    })

    // Inject user in event context for hydration
    event.context.user = user
  } catch (error: any) {
    // Access token expired or invalid
    if (error?.statusCode === 401 && refreshToken) {
      try {
        // Try to refresh
        const result = await $fetch('/auth/refresh', {
          method: 'POST',
          baseURL: process.env.NODE_ENV === 'production' ? config.public.apiUrl : 'http://localhost:3000',
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
          },
        })

        // Set new cookies in response
        setCookie(event, 'access_token', result.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 60, // 30min in seconds
        })

        setCookie(event, 'refresh_token', result.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        })

        event.context.user = result.user
      } catch (refreshError) {
        // Refresh failed, clear cookies
        deleteCookie(event, 'access_token')
        deleteCookie(event, 'refresh_token')
      }
    }
  }
})
```

### 3.3 Refactor Auth Store

**Fichier** : `stores/auth.ts`

```typescript
import { defineStore } from 'pinia'
import type { components } from '~/types/api'

type User = components['schemas']['User']

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const expiresAt = ref<number | null>(null)
  const refreshTimer = ref<NodeJS.Timeout | null>(null)

  // Computed
  const isAuthenticated = computed(() => {
    return !!user.value && !!expiresAt.value && Date.now() < expiresAt.value
  })

  const userRole = computed(() => user.value?.role || null)

  // Actions
  const setUser = (userData: User | null, expiryTime?: number) => {
    user.value = userData
    expiresAt.value = expiryTime || null

    if (userData && expiryTime) {
      setupRefreshTimer()
    } else {
      clearRefreshTimer()
    }
  }

  const setupRefreshTimer = () => {
    clearRefreshTimer()

    if (!expiresAt.value) return

    // Refresh 2 minutes before expiry
    const refreshTime = expiresAt.value - Date.now() - 2 * 60 * 1000

    if (refreshTime > 0) {
      refreshTimer.value = setTimeout(async () => {
        try {
          await refresh()
        } catch (error) {
          console.error('Proactive refresh failed:', error)
          // Will be caught by reactive refresh (401 interceptor)
        }
      }, refreshTime)
    }
  }

  const clearRefreshTimer = () => {
    if (refreshTimer.value) {
      clearTimeout(refreshTimer.value)
      refreshTimer.value = null
    }
  }

  const login = async (email: string, password: string) => {
    const { $api } = useNuxtApp()

    const result = await $api('/auth/login', {
      method: 'POST',
      body: { email, password },
    })

    setUser(result.user, result.expiresAt)
    return result
  }

  const register = async (email: string, password: string) => {
    const { $api } = useNuxtApp()

    const result = await $api('/auth/register', {
      method: 'POST',
      body: { email, password },
    })

    setUser(result.user, result.expiresAt)
    return result
  }

  const refresh = async () => {
    const { $api } = useNuxtApp()

    const result = await $api('/auth/refresh', {
      method: 'POST',
    })

    setUser(result.user, result.expiresAt)
    return result
  }

  const logout = async () => {
    clearRefreshTimer()

    try {
      const { $api } = useNuxtApp()
      await $api('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      // Ignore errors, clear state anyway
      console.error('Logout error:', error)
    }

    setUser(null)
    await navigateTo('/login')
  }

  const loadProfile = async () => {
    const { $api } = useNuxtApp()

    try {
      const profile = await $api('/auth/profile')
      user.value = profile
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  return {
    // State
    user,
    expiresAt,
    // Computed
    isAuthenticated,
    userRole,
    // Actions
    setUser,
    login,
    register,
    refresh,
    logout,
    loadProfile,
  }
})
```

### 3.4 Créer plugin API avec intercepteur

**Fichier** : `plugins/api.ts`

```typescript
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiUrl,
    credentials: 'include', // CRUCIAL: Send cookies automatically

    async onRequest({ options }) {
      // En dev, ajouter le baseURL complet pour le proxy
      if (process.dev && !options.baseURL?.startsWith('http')) {
        options.baseURL = '/api'
      }
    },

    async onResponseError({ response, options }) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        // Skip refresh endpoint to avoid infinite loop
        if (options.url?.includes('/auth/refresh')) {
          await authStore.logout()
          return
        }

        // Try to refresh token
        try {
          await authStore.refresh()

          // Retry original request
          return $fetch(options.url, {
            ...options,
            baseURL: config.public.apiUrl,
          })
        } catch (refreshError) {
          // Refresh failed, logout
          await authStore.logout()
          throw refreshError
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
```

### 3.5 Route middleware

**Fichier** : `middleware/auth.global.ts`

```typescript
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // SSR: Hydrate from server context
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.context.user) {
      // Inject user from server middleware
      const config = useRuntimeConfig()
      authStore.setUser(event.context.user, Date.now() + Number(config.public.accessTokenExpiry))
    }
  }

  // Client: Setup refresh timer on first load
  if (import.meta.client && authStore.user && !authStore.refreshTimer) {
    authStore.setupRefreshTimer()
  }

  // Protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Redirect authenticated users away from auth pages
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
```

### 3.6 Mise à jour des composables API existants

**Fichier** : `composables/api.ts`

```typescript
import { HttpMethod } from '~/types/api-config'

export const useApi = () => {
  const { $api } = useNuxtApp()

  const call = async <T>(
    url: string,
    options: {
      method?: HttpMethod
      body?: any
      requireAuth?: boolean
    } = {},
  ): Promise<T> => {
    const { method = HttpMethod.GET, body } = options

    return $api<T>(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return { call }
}
```

---

## Phase 4 : Tests

### 4.1 Tests à effectuer

#### En développement local

1. **Login**
   - [ ] Login réussit et redirige
   - [ ] Cookies `access_token` et `refresh_token` définis
   - [ ] User visible dans le store

2. **SSR Hydration**
   - [ ] Rafraîchir la page → user toujours connecté
   - [ ] Pas de flash de "loading"
   - [ ] State disponible immédiatement

3. **API Calls**
   - [ ] Requêtes protégées fonctionnent
   - [ ] Cookies envoyés automatiquement

4. **Refresh proactif**
   - [ ] Timer se déclenche 2min avant expiry
   - [ ] Nouveaux tokens reçus
   - [ ] Pas de déconnexion

5. **Refresh réactif (401)**
   - [ ] Attendre expiration access token
   - [ ] Requête → 401 → refresh auto → retry → succès

6. **Logout**
   - [ ] Logout redirige vers /login
   - [ ] Cookies supprimés
   - [ ] Store vidé

7. **Register**
   - [ ] Création compte fonctionne
   - [ ] Cookies définis
   - [ ] Redirection

### 4.2 Tests en production (staging)

1. **HTTPS & Secure cookies**
   - [ ] Cookies avec flag `Secure`
   - [ ] Domain `.nina.fm`

2. **Cross-domain**
   - [ ] `faceb.nina.fm` → `api.nina.fm` fonctionne
   - [ ] Cookies partagés

3. **CORS**
   - [ ] Pas d'erreur CORS
   - [ ] Credentials envoyés

---

## Phase 5 : Déploiement

### 5.1 Checklist pré-déploiement

**API** :

- [ ] Variables d'environnement configurées
- [ ] `cookie-parser` installé
- [ ] CORS avec `credentials: true`
- [ ] `COOKIE_DOMAIN=.nina.fm`
- [ ] `COOKIE_SECURE=true`

**Nuxt** :

- [ ] Variables d'environnement configurées
- [ ] `NUXT_PUBLIC_API_URL=https://api.nina.fm`
- [ ] Proxy dev désactivé en prod

**Docker** :

- [ ] Build images avec nouvelles variables
- [ ] Tester en local avec `docker-compose`

### 5.2 Nginx (reverse proxy)

Vérifier la configuration nginx pour passer les cookies :

```nginx
# /etc/nginx/sites-available/nina.fm

# API
server {
    listen 443 ssl;
    server_name api.nina.fm;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CRUCIAL pour cookies
        proxy_pass_header Set-Cookie;
        proxy_cookie_domain localhost .nina.fm;
    }
}

# Frontend
server {
    listen 443 ssl;
    server_name faceb.nina.fm;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.3 Plan de rollback

En cas de problème, possibilité de rollback :

1. Garder l'ancien système en place pendant 1 semaine
2. Feature flag pour basculer entre ancien et nouveau
3. Logs détaillés pendant la transition

---

## 📊 Comparaison Avant/Après

| Aspect           | Avant              | Après                |
| ---------------- | ------------------ | -------------------- |
| **Stockage**     | localStorage       | httpOnly cookies     |
| **Sécurité XSS** | ❌ Vulnérable      | ✅ Protégé           |
| **SSR**          | Re-fetch client    | State préchargé      |
| **Performance**  | Waterfall requests | 1 requête SSR        |
| **UX**           | Flash de loading   | Instantané           |
| **Refresh**      | Réactif uniquement | Proactif + Réactif   |
| **Complexité**   | Élevée             | Standard             |
| **CORS**         | Complexe           | Simple (credentials) |

---

## 🚨 Points d'attention

1. **Tester en incognito** : Cookies peuvent persister entre tests
2. **HTTPS obligatoire en prod** : Secure flag ne fonctionne pas en HTTP
3. **SameSite=lax** : Cookies envoyés sur navigation top-level uniquement
4. **Cookie size** : JWT peut être volumineux, vérifier limites (4KB max)
5. **Blacklist tokens** : S'assurer que l'API blacklist fonctionne
6. **Logs** : Ajouter des logs pour debug en dev

---

**Prêt à démarrer l'implémentation ?** On peut commencer par la Phase 1 (config) et Phase 2 (API) en premier ! 🚀
