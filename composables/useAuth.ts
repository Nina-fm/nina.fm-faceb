import type { User } from '~/types/api/users.types'

/**
 * Composable central pour l'authentification
 * Gère l'état user (pas les tokens, gérés par cookies httpOnly)
 * Support SSR hydration depuis server middleware
 */
export const useAuth = () => {
  // State minimal : juste user et expiresAt (pas de tokens)
  const user = useState<User | null>('auth:user', () => null)
  const expiresAt = useState<number | null>('auth:expiresAt', () => null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)

  // Actions
  const setUser = (newUser: User | null, expiry?: number) => {
    user.value = newUser
    expiresAt.value = expiry || null
  }

  const clearUser = () => {
    user.value = null
    expiresAt.value = null
  }

  // SSR Hydration : Charger user depuis server context
  if (import.meta.server) {
    const event = useRequestEvent()
    if (event?.context.user) {
      user.value = event.context.user as User
      expiresAt.value = event.context.expiresAt as number | null
    }
  }

  return {
    // State (readonly pour éviter modifications directes)
    user: readonly(user),
    expiresAt: readonly(expiresAt),

    // Computed
    isAuthenticated,
    userRole,

    // Actions
    setUser,
    clearUser,
  }
}
