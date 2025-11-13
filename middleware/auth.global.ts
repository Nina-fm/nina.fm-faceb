/**
 * Middleware d'authentification pour Nina.fm Face B
 * Gère l'authentification JWT et les permissions par rôle
 * Compatible avec l'API Nina.fm (NestJS)
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  authStore.isAuthChecking = true
  try {
    // Vérifier si la page nécessite une authentification
    if (to.meta.auth === false) {
      return
    }

    // Si côté serveur, récupérer les tokens depuis les cookies
    if (import.meta.server) {
      const accessTokenCookie = useCookie('nina_access_token')
      const refreshTokenCookie = useCookie('nina_refresh_token')

      if (!accessTokenCookie.value || !refreshTokenCookie.value) {
        return navigateTo('/login')
      }

      // Vérifier l'expiration du token côté serveur
      try {
        const tokenPart = accessTokenCookie.value?.split('.')[1]
        if (!tokenPart) {
          accessTokenCookie.value = null
          refreshTokenCookie.value = null
          return navigateTo('/login')
        }
        const payload = JSON.parse(atob(tokenPart))
        const now = Math.floor(Date.now() / 1000)

        if (payload.exp && payload.exp < now) {
          accessTokenCookie.value = null
          refreshTokenCookie.value = null
          return navigateTo('/login')
        }
      } catch {
        accessTokenCookie.value = null
        refreshTokenCookie.value = null
        return navigateTo('/login')
      }
    }

    // Chargement du profil utilisateur si nécessaire (client ou serveur)
    if (!authStore.user || !authStore.accessToken) {
      try {
        await authStore.loadUserProfile()
        if (!authStore.user || !authStore.accessToken) {
          return navigateTo('/login')
        }
      } catch (error) {
        console.error('[AUTH] Middleware - erreur chargement profil:', error)
        return navigateTo('/login')
      }
    }

    // Vérifier les permissions selon les métadonnées de la route (client ET serveur)
    const requiredRole = to.meta.requiresRole as string | undefined
    const requiredRoles = (to.meta.requiresRoles || to.meta.roles) as string[] | undefined

    // Attendre que le userRole soit bien défini (évite la redirection prématurée)
    if (requiredRole || (requiredRoles && requiredRoles.length > 0)) {
      let tries = 0
      while (!authStore.userRole && tries < 20) {
        await new Promise((resolve) => setTimeout(resolve, 25))
        tries++
      }

      // Si après le délai userRole est toujours indéfini, on ne redirige pas (on laisse le loader tourner)
      if (!authStore.userRole) {
        return
      }

      if (requiredRole && authStore.userRole !== requiredRole) {
        return navigateTo('/login')
      }

      if (requiredRoles && requiredRoles.length > 0) {
        const hasValidRole = requiredRoles.includes(authStore.userRole || '')
        if (!hasValidRole) {
          return navigateTo('/')
        }
      }
    }
  } finally {
    authStore.isAuthChecking = false
  }
})
