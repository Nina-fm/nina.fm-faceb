import Session from 'supertokens-web-js/recipe/session'
import type { User } from '~/types/api/users.types'

/**
 * Composable pour les actions d'authentification SuperTokens
 *
 * SuperTokens SDK gère automatiquement le refresh des tokens.
 * On appelle juste les endpoints et on met à jour l'UI.
 */
export const useAuthActions = () => {
  const { setUser, clearUser } = useAuth()
  const router = useRouter()
  const config = useRuntimeConfig()

  /**
   * Login avec email/password
   * SuperTokens géré en interne par l'API, retourne profil complet
   */
  const login = async (email: string, password: string) => {
    const response = await $fetch<{ user: User; expiresAt: number }>(`${config.public.apiUrl}/auth/login`, {
      method: 'POST',
      body: { email, password, appSlug: 'faceb' },
      credentials: 'include',
    })

    setUser(response.user)
    return response
  }

  /**
   * Register avec email/password + name
   * SuperTokens géré en interne par l'API, retourne profil complet
   * @param invitationToken - Token d'invitation pour assigner le rôle
   */
  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    invitationToken?: string
  }) => {
    // Combine firstName + lastName en name pour l'API
    const name = `${data.firstName} ${data.lastName}`.trim()

    const response = await $fetch<{ user: User; expiresAt: number }>(`${config.public.apiUrl}/auth/register`, {
      method: 'POST',
      body: {
        email: data.email,
        password: data.password,
        name,
        invitationToken: data.invitationToken,
        appSlug: 'faceb',
      },
      credentials: 'include',
    })

    setUser(response.user)
    return response
  }

  /**
   * Logout - utilise SuperTokens signOut
   */
  const logout = async () => {
    try {
      // SuperTokens signOut révoque la session et nettoie les cookies
      await Session.signOut()
    } catch (error) {
      console.warn('[Auth] Logout error:', error)
    }

    clearUser()
    await router.push('/login')
  }

  /**
   * Request password reset email
   */
  const requestPasswordReset = async (email: string) => {
    await $fetch(`${config.public.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      body: {
        email,
        origin: window.location.origin, // Pour que SuperTokens redirige vers la bonne app
      },
    })
  }

  /**
   * Reset password with token + auto-login for Face B users
   * Note: Password reset is handled automatically by SuperTokens via email link
   * This function just attempts login with the new password
   */
  const resetPasswordAndLogin = async (newPassword: string, email: string) => {
    // Try to login with new password (assuming reset was successful via SuperTokens)
    try {
      const loginResponse = await login(email, newPassword)
      return { success: true, user: loginResponse.user }
    } catch (error) {
      // Login failed - user needs to try again or reset again
      console.warn('[Auth] Login with new password failed:', error)
      return { success: false, user: null }
    }
  }

  /**
   * Check if an email already exists in the system
   */
  const checkEmailExists = async (email: string): Promise<{ exists: boolean; message: string }> => {
    const response = await $fetch<{ exists: boolean; message: string }>(`${config.public.apiUrl}/auth/check-email`, {
      method: 'GET',
      params: { email },
    })
    return response
  }

  /**
   * Link an existing account with an invitation
   * Used when user already has an account (e.g., from Mixtaper) and is invited to Face B
   */
  const linkAccountWithInvitation = async (data: {
    email: string
    password: string
    invitationToken: string
    name?: string
  }) => {
    const response = await $fetch<{ user: User; expiresAt: number }>(`${config.public.apiUrl}/auth/link-invitation`, {
      method: 'POST',
      body: { ...data, appSlug: 'faceb' },
      credentials: 'include',
    })

    setUser(response.user)
    return response
  }

  return {
    login,
    register,
    logout,
    requestPasswordReset,
    resetPasswordAndLogin,
    checkEmailExists,
    linkAccountWithInvitation,
  }
}
