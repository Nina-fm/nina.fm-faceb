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
   * SuperTokens gère les cookies automatiquement
   */
  const login = async (email: string, password: string) => {
    const response = await $fetch<{ user: User }>(`${config.public.apiUrl}/auth/signin`, {
      method: 'POST',
      body: {
        formFields: [
          { id: 'email', value: email },
          { id: 'password', value: password },
        ],
      },
      credentials: 'include',
    })

    setUser(response.user)
    return response
  }

  /**
   * Register avec email/password + firstName/lastName
   * SuperTokens gère les cookies automatiquement
   */
  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await $fetch<{ user: User }>(`${config.public.apiUrl}/auth/signup`, {
      method: 'POST',
      body: {
        formFields: [
          { id: 'email', value: data.email },
          { id: 'password', value: data.password },
          { id: 'firstName', value: data.firstName },
          { id: 'lastName', value: data.lastName },
        ],
      },
      credentials: 'include',
    })

    setUser(response.user)
    return response
  }

  /**
   * Logout
   * SuperTokens clear les cookies automatiquement
   */
  const logout = async () => {
    try {
      await $fetch(`${config.public.apiUrl}/auth/signout`, {
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
   */
  const resetPassword = async (token: string, newPassword: string) => {
    await $fetch(`${config.public.apiUrl}/auth/user/password/reset`, {
      method: 'POST',
      body: {
        formFields: [{ id: 'password', value: newPassword }],
        token,
      },
    })
  }

  return {
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
  }
}
