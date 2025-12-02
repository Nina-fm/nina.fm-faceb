# SuperTokens Integration - Face B

## Vue d'ensemble

Face B utilise SuperTokens pour l'authentification avec l'API Nina.fm.

## Installation

```bash
pnpm add supertokens-auth-react
```

## Configuration

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  ssr: false, // SuperTokens nécessite CSR

  runtimeConfig: {
    public: {
      supertokensApiDomain: process.env.NUXT_PUBLIC_SUPERTOKENS_API_DOMAIN || 'http://localhost:4000',
      supertokensWebsiteDomain: process.env.NUXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN || 'http://localhost:3002',
    },
  },
})
```

### .env

```env
NUXT_PUBLIC_SUPERTOKENS_API_DOMAIN=http://localhost:4000
NUXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN=http://localhost:3002
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Composables

### useAuth

```typescript
const { user, isAuthenticated, isLoading } = useAuth()

// user: Ref<User | null>
// isAuthenticated: ComputedRef<boolean>
// isLoading: Ref<boolean>
```

### useAuthActions

```typescript
const { login, signup, logout, resetPasswordAndLogin } = useAuthActions()

// Login
await login({ email, password })

// Signup
await signup({ email, password, name })

// Logout
await logout()

// Reset password + auto-login
await resetPasswordAndLogin(token, newPassword)
```

## Pages d'authentification

### Forgot Password

**Path** : `/reset-password`

```vue
<script setup>
  const { forgotPassword } = useInvitationApi() // Utilise l'API invitations

  const handleSubmit = async ({ email }: { email: string }) => {
    const origin = import.meta.client
      ? window.location.origin
      : 'http://localhost:3002'

    await forgotPassword.mutateAsync({ email, origin })
    toast.success('Email envoyé !')
  }
</script>
```

**Features** :

- ✅ Envoie l'origin de l'app au backend
- ✅ Backend construit le reset link avec cette origin
- ✅ Email pré-rempli dans le lien

### Set Password

**Path** : `/set-password`

**Query params** :

- `token` : JWT token de reset
- `email` : Email pré-rempli (optionnel)

```vue
<script setup>
  const route = useRoute()
  const router = useRouter()
  const { resetPasswordAndLogin } = useAuthActions()

  const token = route.query.token as string
  const emailFromUrl = route.query.email as string

  const form = useForm({
    validationSchema: toTypedSchema(setPasswordFormSchema),
    initialValues: {
      email: emailFromUrl || '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = async (values: SetPasswordFormData) => {
    try {
      await resetPasswordAndLogin(token, values.password)
      toast.success('Mot de passe défini ! Vous êtes connecté.')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Token invalide ou expiré')
    }
  }
</script>
```

**Features** :

- ✅ Email pré-rempli et disabled si vient de l'URL
- ✅ Auto-login après reset réussi
- ✅ Redirect vers dashboard

## Invitations

### Flow complet

```typescript
// 1. Admin envoie invitation
const { sendInvitation } = useInvitationApi()
await sendInvitation.mutateAsync({
  email: 'user@example.com',
  role: 'CONTRIBUTOR',
  message: 'Rejoignez Nina.fm !',
})

// 2. User reçoit email avec lien signup
// http://localhost:3002/signup?invitationToken=jwt-token

// 3. Page signup utilise le token
const route = useRoute()
const invitationToken = route.query.invitationToken as string

await signup({
  email: 'user@example.com',
  password: 'password',
  name: 'John Doe',
  invitationToken, // Passé à l'API
})

// 4. Backend assigne le rôle CONTRIBUTOR au user
```

### Bug corrigé : Triple envoi

**Problème** : Invitations envoyées 3 fois.

**Cause** : Chaîne d'appels dupliqués :

- `InvitationForm.vue` appelait `sendInvitation.mutateAsync()`
- Émettait `@submit` vers `InvitationDialog.vue`
- Qui émettait vers `pages/invitations/index.vue`
- Qui rappelait `sendInvitation.mutateAsync()` → **3 appels !**

**Solution** :

```vue
<!-- InvitationForm.vue -->
<script setup>
  const handleSubmit = (values: InvitationFormData) => {
    // NE PLUS appeler l'API ici, juste émettre
    emit('submit', values)
    form.resetForm()
  }
</script>

<!-- InvitationDialog.vue -->
<script setup>
  const handleSubmit = (payload) => {
    // NE PLUS fermer le dialog ici, laisser le parent gérer
    emit('submit', payload)
  }
</script>

<!-- pages/invitations/index.vue -->
<script setup>
  const handleSubmitInvite = async (payload) => {
    try {
      // SEUL endroit où l'API est appelée
      await sendInvitation.mutateAsync(payload)
      toast.success(`Invitation envoyée à ${payload.email} !`)
      openInviteDialog.value = false // Fermeture ici
    } catch (error) {
      toast.error(error.message)
    }
  }
</script>
```

## Session Management

### Auto-refresh

SuperTokens gère automatiquement le refresh des tokens via cookies.

### Session check

```typescript
// Middleware auth
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading.value && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

### Logout

```typescript
const { logout } = useAuthActions()

await logout()
// → Cookies cleared
// → Redirect to login
```

## API Integration

### Composables API

**Pattern** : TanStack Query pour toutes les requêtes

```typescript
// composables/invitationApi.ts
export const useInvitationApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  const sendInvitation = useMutation({
    mutationFn: async (payload: SendInvitationDto) =>
      call('/invitations/send', {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() })
    },
  })

  return { sendInvitation }
}
```

### Auth Headers

SuperTokens injecte automatiquement les headers nécessaires via cookies httpOnly.

## Types

### User

```typescript
interface User {
  id: string
  email: string
  role: Role
  profile: {
    nickname: string
    avatar?: ImageFile
  }
}

enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  VIEWER = 'VIEWER',
  PUBLIC = 'PUBLIC',
}
```

### Session Payload

```typescript
interface SessionPayload {
  sub: string // user ID
  role: Role
  email: string
  firstName: string
  lastName: string
  apps_access: {
    mixtaper: boolean
    faceb: boolean
    libretime: boolean
  }
}
```

## Troubleshooting

### Session not persisting

**Cause** : Cookie domain incorrect

**Solution** :

```env
# Dev
COOKIE_DOMAIN=localhost  # Sans point

# Prod
COOKIE_DOMAIN=.nina.fm   # Avec point pour SSO
```

### 401 Unauthorized

**Causes** :

1. Session expirée → Auto-refresh devrait gérer
2. Cookie domain mismatch → Vérifier `.env`
3. CORS issues → Vérifier config API

### User role not updated

**Cause** : Cache TanStack Query

**Solution** :

```typescript
await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() })
```

## Documentation

- [SuperTokens React SDK](https://supertokens.com/docs/emailpassword/quick-setup/frontend)
- [TanStack Query](https://tanstack.com/query/latest/docs/vue/overview)
- `docs/AUTH_IMPLEMENTATION_PLAN.md` - Plan d'implémentation
- `/Users/vincent/Sites/nina/nina.fm-api/docs/SUPERTOKENS_INTEGRATION.md` - Doc API
