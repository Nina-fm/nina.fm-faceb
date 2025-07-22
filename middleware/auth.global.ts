/**
 * Middleware d'authentification pour Nina.fm Face B
 * Gère l'authentification JWT et les permissions par rôle
 * Compatible avec l'API Nina.fm (NestJS)
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Vérifier si la page nécessite une authentification
  if (to.meta.auth === false) {
    console.log('[AUTH] Middleware - page publique, autorisation sans vérification')
    return
  }

  const authStore = useAuthStore()

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

  // Côté client : utiliser le store auth
  if (import.meta.client) {
    // Si pas d'utilisateur dans le store, essayer de charger depuis les tokens
    if (!authStore.user || !authStore.accessToken) {
      console.log("[AUTH] Middleware - pas d'utilisateur côté client, chargement du profil...")

      try {
        await authStore.loadUserProfile()

        // Si toujours pas d'utilisateur après chargement, rediriger
        if (!authStore.user || !authStore.accessToken) {
          console.log('[AUTH] Middleware - chargement profil échoué, redirection vers /login')
          return navigateTo('/login')
        }
      } catch (error) {
        console.error('[AUTH] Middleware - erreur chargement profil:', error)
        return navigateTo('/login')
      }
    }

    // Vérifier les permissions selon les métadonnées de la route
    const requiredRole = to.meta.requiresRole as string | undefined
    const requiredRoles = to.meta.requiresRoles as string[] | undefined

    if (requiredRole && authStore.userRole !== requiredRole) {
      console.log(`[AUTH] Middleware - rôle requis: ${requiredRole}, rôle utilisateur: ${authStore.userRole}`)
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès non autorisé - Permissions insuffisantes',
      })
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasValidRole = requiredRoles.includes(authStore.userRole || '')
      if (!hasValidRole) {
        console.log(
          `[AUTH] Middleware - rôles requis: ${requiredRoles.join(', ')}, rôle utilisateur: ${authStore.userRole}`,
        )
        throw createError({
          statusCode: 403,
          statusMessage: 'Accès non autorisé - Permissions insuffisantes',
        })
      }
    }
  }

  console.log('[AUTH] Middleware - accès autorisé à:', to.path)
})
