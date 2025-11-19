import type { User } from '~/types/api/users.types'

/**
 * Composable central pour l'authentification
 * Gère l'état user (pas les tokens, gérés par cookies httpOnly)
 * SSR: user chargé par server middleware
 * Client: user chargé au mount via fetchUser()
 */
export const useAuth = () => {
  // State minimal : juste user et expiresAt (pas de tokens)
  const user = useState<User | null>('auth:user', () => null)
  const expiresAt = useState<number | null>('auth:expiresAt', () => null)
  const isAuthLoading = useState<boolean>('auth:isLoading', () => true)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)

  // Fetch user from API (client-side only)
  const fetchUser = async () => {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<{ user: User; expiresAt: number }>(`${config.public.apiUrl}/auth/profile`, {
        credentials: 'include',
      })
      user.value = response.user
      expiresAt.value = response.expiresAt
      return response.user
    } catch {
      user.value = null
      expiresAt.value = null
      return null
    } finally {
      isAuthLoading.value = false
    }
  }

  // Actions
  const setUser = (newUser: User | null, expiry?: number) => {
    user.value = newUser
    expiresAt.value = expiry || null
  }

  const clearUser = () => {
    user.value = null
    expiresAt.value = null
  }

  return {
    // State (readonly pour éviter modifications directes)
    user: readonly(user),
    expiresAt: readonly(expiresAt),
    isAuthLoading: readonly(isAuthLoading),

    // Computed
    isAuthenticated,
    userRole,

    // Actions
    setUser,
    clearUser,
    fetchUser,
  }
}
