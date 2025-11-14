/**
 * Composable de compatibilité pour migration
 * Provides legacy useAuthApi() interface using new auth system
 * TODO: Remove after migrating all pages
 */
export const useAuthApi = () => {
  const { user } = useAuth()
  const { resetPassword: resetPasswordAction, logout: logoutAction } = useAuthActions()
  const config = useRuntimeConfig()

  // currentUserId: ID de l'utilisateur connecté
  const currentUserId = computed(() => user.value?.id || null)

  // refreshSession: Recharger le profil utilisateur
  const refreshSession = async () => {
    // Force full page reload to re-fetch user from SSR
    window.location.reload()
  }

  // forgotPassword: Envoyer email de reset
  const forgotPassword = async (email: string) => {
    const response = await $fetch<{ success: boolean }>(`${config.public.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      body: { email },
      credentials: 'include',
    })
    return response
  }

  // resetPassword: Réinitialiser avec token
  const resetPassword = async (token: string, password: string) => {
    return resetPasswordAction(token, password)
  }

  // logout: Déconnexion
  const logout = async () => {
    await logoutAction()
  }

  return {
    user, // Expose user for legacy components
    currentUserId,
    refreshSession,
    forgotPassword,
    resetPassword,
    logout,
  }
}
