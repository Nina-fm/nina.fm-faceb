import type { User } from '~/types/api/users.types'

/**
 * Composable ultra-léger pour l'authentification SuperTokens
 *
 * SuperTokens gère TOUT automatiquement :
 * - Cookies httpOnly (access + refresh tokens)
 * - Refresh automatique des sessions
 * - Sécurité et expiration
 *
 * Ce composable ne gère QUE l'état user pour l'UI
 */
export const useAuth = () => {
  // State minimal : juste le user (SuperTokens gère les cookies)
  const user = useState<User | null>('auth:user', () => null)
  const isAuthLoading = useState<boolean>('auth:isLoading', () => true)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)

  // Fetch user depuis SuperTokens session
  const fetchUser = async () => {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<User>(`${config.public.apiUrl}/auth/session`, {
        credentials: 'include',
      })
      user.value = response
      return response
    } catch {
      user.value = null
      return null
    } finally {
      isAuthLoading.value = false
    }
  }

  return {
    // State (readonly)
    user: readonly(user),
    isAuthLoading: readonly(isAuthLoading),

    // Computed
    isAuthenticated,
    userRole,

    // Actions
    setUser: (newUser: User | null) => {
      user.value = newUser
    },
    clearUser: () => {
      user.value = null
    },
    fetchUser,
  }
}
