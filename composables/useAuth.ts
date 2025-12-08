import type { User } from '~/types/api/users.types'

/**
 * Composable pour l'authentification SuperTokens
 *
 * SuperTokens SDK gère automatiquement :
 * - Les cookies httpOnly
 * - Le refresh des tokens (automatique et proactif)
 * - La sécurité et l'expiration
 *
 * Ce composable gère uniquement l'état user pour l'UI.
 */
export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const isAuthLoading = useState<boolean>('auth:isLoading', () => true)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)

  // Fetch user depuis profile - SuperTokens intercepte et gère le refresh automatiquement
  const fetchUser = async () => {
    try {
      const config = useRuntimeConfig()
      const response = await $fetch<{ user: User; expiresAt: number }>(`${config.public.apiUrl}/auth/profile`, {
        credentials: 'include',
      })
      user.value = response.user
      return response.user
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
