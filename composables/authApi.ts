/**
 * Composable d'authentification pour l'API Nina.fm
 * Gère login, register, logout et intégration avec TanStack Query
 */
export const useAuthApi = () => {
  const authStore = useAuthStore()
  const { post } = useApi()
  const { getImagePublicUrl } = useImageApi()
  const { hasRole, hasAnyRole } = useRoles()

  const user = computed(() => {
    if (!authStore.user) return null

    return {
      ...authStore.user,
      // Le nom vient du profile (nickname)
      name: authStore.user.profile?.nickname || authStore.user.email,
      avatar: authStore.user.profile?.avatar
        ? {
            ...authStore.user.profile.avatar,
            url: getImagePublicUrl(authStore.user.profile.avatar.uri, authStore.user.profile.avatar.bucket || ''),
            alt: authStore.user.profile?.nickname || authStore.user.email,
          }
        : undefined,
    }
  })

  const currentUserId = computed(() => authStore.user?.id)
  const isLoggedIn = computed(() => !!authStore.user && !!authStore.accessToken)

  const register = async ({
    email,
    name,
    password,
    invitationToken,
  }: {
    email: string
    password: string
    name?: string
    invitationToken?: string
  }) => {
    authStore.isLoading = true

    try {
      await post(
        '/auth/register',
        {
          email,
          name,
          password,
          invitationToken,
        },
        { requireAuth: false },
      )

      // Auto-login après inscription
      return await login(email, password)
    } finally {
      // Note: le loading sera géré par login()
    }
  }

  const login = async (email: string, password: string) => {
    authStore.isLoading = true

    try {
      const response = await post(
        '/auth/login',
        {
          email,
          password,
        },
        { requireAuth: false },
      )

      // Stocker les tokens (attention: l'API retourne access_token et refresh_token avec underscores)
      await authStore.setTokens(response.access_token, response.refresh_token)

      // Charger le profil utilisateur avec le token fraîchement reçu
      await loadUserProfileWithToken(response.access_token)

      // Redirection vers la page demandée ou l'accueil
      await navigateTo('/')
    } finally {
      authStore.isLoading = false
    }
  }

  /**
   * Charger le profil utilisateur avec un token spécifique
   */
  const loadUserProfileWithToken = async (token: string) => {
    try {
      const config = useRuntimeConfig()
      const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'

      const profile = await $fetch<User>('/auth/profile', {
        method: 'GET',
        baseURL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (profile) {
        authStore.setUser(profile)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
      throw error
    }
  }

  const logout = async () => {
    authStore.isLoading = true

    try {
      try {
        await post('/auth/logout', {}, { requireAuth: true })
      } catch (error) {
        // On continue même si la déconnexion côté serveur échoue
        console.warn('Erreur lors de la déconnexion côté serveur:', error)
      }

      // Effacer les données locales
      authStore.clearAuth()
      await navigateTo('/login')
    } finally {
      authStore.isLoading = false
    }
  }

  const refreshSession = async () => {
    try {
      await authStore.refreshTokens()
      await authStore.loadUserProfile()
    } catch (error) {
      console.error('Erreur lors du refresh de session:', error)
      throw error
    }
  }

  return {
    // State
    currentUserId,
    user,
    isLoggedIn,
    // Actions
    hasRole: (role: string) => hasRole(authStore.user?.role, role),
    hasAnyRole: (roles: string[]) => hasAnyRole(authStore.user?.role, roles),
    login,
    logout,
    refreshSession,
    register,
  }
}
