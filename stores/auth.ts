import { defineStore } from 'pinia'

// Suppression de l'interface AuthTokens non utilisée

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref<boolean>(false)
  // Flag global pour le middleware
  const isAuthChecking = ref<boolean>(true)

  // Computed
  const isLoggedIn = computed(() => !!user.value && !!accessToken.value)
  const userRole = computed(() => user.value?.role || null)
  const hasProfile = computed(() => !!user.value?.profile)

  /**
   * Stocker les tokens dans le store, localStorage et cookies
   */
  const setTokens = async (newAccessToken: string, newRefreshToken: string) => {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken

    // Persister dans localStorage (côté client)
    if (import.meta.client) {
      localStorage.setItem('nina_access_token', newAccessToken)
      localStorage.setItem('nina_refresh_token', newRefreshToken)
    }

    // Persister dans les cookies (accessible côté serveur et client)
    const accessTokenCookie = useCookie('nina_access_token', {
      default: () => '',
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
    })
    const refreshTokenCookie = useCookie('nina_refresh_token', {
      default: () => '',
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    accessTokenCookie.value = newAccessToken
    refreshTokenCookie.value = newRefreshToken
  }

  /**
   * Définir l'utilisateur connecté
   */
  const setUser = (userData: User) => {
    user.value = userData
  }

  /**
   * Nettoyer l'authentification
   */
  const clearAuth = async () => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    // Nettoyer localStorage
    if (import.meta.client) {
      localStorage.removeItem('nina_access_token')
      localStorage.removeItem('nina_refresh_token')
    }

    // Nettoyer les cookies (seulement dans un contexte Nuxt valide)
    try {
      const accessTokenCookie = useCookie('nina_access_token')
      const refreshTokenCookie = useCookie('nina_refresh_token')
      accessTokenCookie.value = null
      refreshTokenCookie.value = null
    } catch (error) {
      // Si on ne peut pas accéder aux cookies, ce n'est pas grave
      console.warn('[AUTH] Impossible de nettoyer les cookies:', error)
    }
  }

  /**
   * Charger les tokens depuis localStorage/cookies et récupérer le profil
   */
  const loadUserProfile = async () => {
    console.log('[AUTH] loadUserProfile - démarrage')
    isLoading.value = true
    try {
      let storedAccessToken: string | null = null
      let storedRefreshToken: string | null = null

      if (import.meta.client) {
        // Côté client : localStorage puis cookies
        storedAccessToken = localStorage.getItem('nina_access_token')
        storedRefreshToken = localStorage.getItem('nina_refresh_token')
        if (!storedAccessToken || !storedRefreshToken) {
          const accessTokenCookie = useCookie('nina_access_token')
          const refreshTokenCookie = useCookie('nina_refresh_token')
          storedAccessToken = accessTokenCookie.value || null
          storedRefreshToken = refreshTokenCookie.value || null
        }
      } else {
        // Côté serveur : cookies uniquement
        const accessTokenCookie = useCookie('nina_access_token')
        const refreshTokenCookie = useCookie('nina_refresh_token')
        storedAccessToken = accessTokenCookie.value || null
        storedRefreshToken = refreshTokenCookie.value || null
      }

      console.log('[AUTH] loadUserProfile - tokens trouvés:', {
        hasAccessToken: !!storedAccessToken,
        hasRefreshToken: !!storedRefreshToken,
        accessTokenStart: storedAccessToken?.substring(0, 20) + '...',
        isServer: import.meta.server,
      })

      if (!storedAccessToken || !storedRefreshToken) {
        console.log('[AUTH] loadUserProfile - pas de tokens, abandon')
        return
      }

      // Restaurer les tokens
      accessToken.value = storedAccessToken
      refreshToken.value = storedRefreshToken

      console.log('[AUTH] loadUserProfile - tokens restaurés dans le store')

      // Utiliser $fetch directement pour éviter les boucles avec useApi
      const config = useRuntimeConfig()
      const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'

      console.log('[AUTH] loadUserProfile - appel /auth/profile...')

      const profile = await $fetch<User>('/auth/profile', {
        method: 'GET',
        baseURL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedAccessToken}`,
        },
      })

      if (profile) {
        setUser(profile)
        console.log('[AUTH] loadUserProfile - profil chargé avec succès:', profile.email)
      } else {
        console.log('[AUTH] loadUserProfile - profil invalide, nettoyage')
        // Profil invalide, nettoyer
        await clearAuth()
      }
    } catch (error: unknown) {
      console.error('[AUTH] loadUserProfile - erreur:', error)
      // Simplification : essayer le refresh sur toute erreur HTTP
      console.log('[AUTH] loadUserProfile - erreur détectée, tentative de refresh...')
      const refreshSuccess = await refreshTokens()
      if (!refreshSuccess) {
        console.log('[AUTH] loadUserProfile - refresh échoué, déconnexion')
        await clearAuth()
      } else {
        console.log('[AUTH] loadUserProfile - refresh réussi')
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Rafraîchir les tokens
   */
  const refreshTokens = async () => {
    if (!refreshToken.value) {
      await clearAuth()
      return false
    }

    try {
      // Utiliser $fetch directement pour éviter la boucle infinie avec useApi
      const config = useRuntimeConfig()
      const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'

      const response = await $fetch<{ access_token: string; refresh_token: string }>('/auth/refresh', {
        method: 'POST',
        baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          refresh_token: refreshToken.value,
        },
      })

      if (response.access_token && response.refresh_token) {
        await setTokens(response.access_token, response.refresh_token)

        // Charger le profil avec le nouveau token (sans risque de boucle)
        try {
          const config = useRuntimeConfig()
          const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'

          const profile = await $fetch<User>('/auth/profile', {
            method: 'GET',
            baseURL,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${response.access_token}`,
            },
          })

          if (profile) {
            setUser(profile)
          }
        } catch (profileError) {
          console.error('Erreur lors du chargement du profil après refresh:', profileError)
          // Ne pas faire clearAuth ici, on a déjà les nouveaux tokens
        }

        return true
      } else {
        await clearAuth()
        return false
      }
    } catch (error) {
      console.error('Erreur lors du refresh:', error)
      await clearAuth()
      return false
    }
  }

  /**
   * Gérer l'expiration du token
   */
  const handleTokenExpired = async () => {
    console.log('[AUTH] handleTokenExpired - démarrage')
    const success = await refreshTokens()
    console.log('[AUTH] handleTokenExpired - refresh result:', success)
    if (!success) {
      console.log('[AUTH] handleTokenExpired - refresh échoué, redirection vers /login')
      await navigateTo('/login')
    } else {
      console.log('[AUTH] handleTokenExpired - refresh réussi, pas de redirection')
    }
  }

  return {
    // État
    user,
    accessToken,
    refreshToken,
    isLoggedIn,
    isLoading,
    isAuthChecking,
    userRole,
    hasProfile,

    // Actions
    setTokens,
    setUser,
    clearAuth,
    loadUserProfile,
    refreshTokens,
    handleTokenExpired,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
