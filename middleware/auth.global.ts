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
      console.log('[AUTH] Middleware - page publique, autorisation sans vérification')
      return
    }

    console.log('[AUTH] Middleware - côté:', import.meta.server ? 'serveur' : 'client', 'route:', to.path)
    console.log('[AUTH] Middleware - user:', !!authStore.user, 'token:', !!authStore.accessToken)

    // Si côté serveur, récupérer les tokens depuis les cookies
    if (import.meta.server) {
      const accessTokenCookie = useCookie('nina_access_token')
      const refreshTokenCookie = useCookie('nina_refresh_token')

      if (!accessTokenCookie.value || !refreshTokenCookie.value) {
        console.log('[AUTH] Middleware - pas de tokens côté serveur, redirection vers /login')
        return navigateTo('/login')
      }

      // Vérifier l'expiration du token côté serveur
      try {
        const payload = JSON.parse(atob(accessTokenCookie.value.split('.')[1]))
        const now = Math.floor(Date.now() / 1000)

        if (payload.exp && payload.exp < now) {
          console.log('[AUTH] Middleware - token expiré côté serveur, nettoyage et redirection')
          accessTokenCookie.value = null
          refreshTokenCookie.value = null
          return navigateTo('/login')
        }
      } catch {
        console.log('[AUTH] Middleware - token invalide côté serveur, nettoyage et redirection')
        accessTokenCookie.value = null
        refreshTokenCookie.value = null
        return navigateTo('/login')
      }
    }

    // Chargement du profil utilisateur si nécessaire (client ou serveur)
    if (!authStore.user || !authStore.accessToken) {
      try {
        await authStore.loadUserProfile()
        console.log('[AUTH] Middleware - après loadUserProfile:', {
          user: authStore.user,
          accessToken: authStore.accessToken,
          userRole: authStore.userRole,
          isServer: import.meta.server,
        })
        if (!authStore.user || !authStore.accessToken) {
          console.log('[AUTH] Middleware - chargement profil échoué, redirection vers /login')
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
        console.warn('[AUTH] Middleware - userRole toujours indéfini après attente, on ne redirige pas')
        return
      }

      if (requiredRole && authStore.userRole !== requiredRole) {
        console.log(`[AUTH] Middleware - rôle requis: ${requiredRole}, rôle utilisateur: ${authStore.userRole}`)
        return navigateTo('/login')
      }

      if (requiredRoles && requiredRoles.length > 0) {
        const hasValidRole = requiredRoles.includes(authStore.userRole || '')
        console.log(
          `[AUTH] Middleware - rôles requis: ${requiredRoles.join(', ')}, rôle utilisateur: ${authStore.userRole}, accès autorisé: ${hasValidRole}`,
        )
        if (!hasValidRole) {
          console.log('[AUTH] Middleware - accès refusé, redirection vers /')
          return navigateTo('/')
        }
      }
    }

    console.log('[AUTH] Middleware - accès autorisé à:', to.path)
  } finally {
    authStore.isAuthChecking = false
  }
})
