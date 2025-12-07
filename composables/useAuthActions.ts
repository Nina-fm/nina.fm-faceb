import type { User } from '~/types/api/users.types'

/**
 * Composable ultra-léger pour les actions d'authentification SuperTokens
 *
 * SuperTokens gère automatiquement :
 * - Cookies httpOnly (access + refresh)
 * - Refresh des tokens
 * - Expiration des sessions
 *
 * On appelle juste les endpoints et on met à jour l'UI
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
      body: { email, password },
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
      },
      credentials: 'include',
    })

    setUser(response.user)
    return response
  }

  /**
   * Logout
   * SuperTokens géré en interne par l'API
   */
  const logout = async () => {
    try {
      await $fetch(`${config.public.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
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
    await $fetch(`${config.public.apiUrl}/auth/user/password/reset/token`, {
      method: 'POST',
      body: {
        formFields: [{ id: 'email', value: email }],
      },
    })
  }

  /**
   * Reset password with token
   * Returns success status
   */
  const resetPassword = async (token: string, newPassword: string) => {
    const response = await $fetch<{ success: boolean; message?: string }>(
      `${config.public.apiUrl}/auth/reset-password-confirm`,
      {
        method: 'POST',
        body: {
          token,
          password: newPassword,
        },
        credentials: 'include',
      },
    )
    return response
  }

  /**
   * Reset password with token + auto-login for Face B users
   * Returns user if login successful, null otherwise
   */
  const resetPasswordAndLogin = async (token: string, newPassword: string, email: string) => {
    // 1. Reset password
    const resetResult = await resetPassword(token, newPassword)

    if (!resetResult.success) {
      return { success: false, user: null }
    }

    // 2. Auto-login with new password
    try {
      const loginResponse = await login(email, newPassword)
      return { success: true, user: loginResponse.user }
    } catch (error) {
      // Reset succeeded but login failed - user can login manually
      console.warn('[Auth] Password reset succeeded but auto-login failed:', error)
      return { success: true, user: null }
    }
  }

  return {
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    resetPasswordAndLogin,
  }
}
