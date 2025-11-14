import type { User } from '~/types/api/users.types'

/**
 * Composable pour les actions d'authentification
 * Login, register, logout - utilise cookies httpOnly
 */
export const useAuthActions = () => {
  const { setUser, clearUser } = useAuth()
  const { startRefreshTimer, stopRefreshTimer } = useTokenRefresh()
  const router = useRouter()
  const config = useRuntimeConfig()

  /**
   * Login avec email/password
   * L'API set les cookies httpOnly automatiquement
   */
  const login = async (email: string, password: string) => {
    const response = await $fetch<{ user: User; expiresAt: number }>(`${config.public.apiUrl}/auth/login`, {
      method: 'POST',
      body: { email, password },
      credentials: 'include', // Important: envoyer et recevoir cookies
    })

    // Cookies déjà set par l'API, on stocke juste le user
    setUser(response.user, response.expiresAt)

    // Démarrer le timer de refresh automatique
    startRefreshTimer()

    return response
  }

  /**
   * Register avec email/password + invitation token optionnel
   * L'API set les cookies httpOnly automatiquement
   */
  const register = async (data: { email: string; password: string; name?: string; invitationToken?: string }) => {
    const response = await $fetch<{ user: User; expiresAt: number }>(`${config.public.apiUrl}/auth/register`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    })

    // Cookies déjà set par l'API
    setUser(response.user, response.expiresAt)

    // Démarrer le timer de refresh automatique
    startRefreshTimer()

    return response
  }

  /**
   * Logout
   * L'API clear les cookies httpOnly automatiquement
   */
  const logout = async () => {
    try {
      await $fetch(`${config.public.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Envoyer les cookies pour blacklist
      })
    } catch (error) {
      // Même si l'API échoue, on clear le state local
      console.warn('[Auth] Logout API error:', error)
    }

    // Arrêter le timer de refresh
    stopRefreshTimer()

    // Clear user state
    clearUser()

    // Redirect to login
    await router.push('/login')
  }

  /**
   * Reset password (forgot password flow)
   */
  const resetPassword = async (token: string, password: string) => {
    const response = await $fetch<{ success: boolean }>(`${config.public.apiUrl}/auth/reset-password`, {
      method: 'POST',
      body: { token, password },
    })

    return response
  }

  return {
    login,
    register,
    logout,
    resetPassword,
  }
}
