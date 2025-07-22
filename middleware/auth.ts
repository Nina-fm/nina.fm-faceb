export default defineNuxtRouteMiddleware((to) => {
  // Récupérer les cookies (disponibles côté serveur et client)
  const accessTokenCookie = useCookie('nina_access_token')
  const refreshTokenCookie = useCookie('nina_refresh_token')

  console.log('[AUTH] Middleware - côté:', import.meta.server ? 'serveur' : 'client', 'route:', to.path)

  // Vérifier la présence des tokens dans les cookies
  if (!accessTokenCookie.value || !refreshTokenCookie.value) {
    console.log('[AUTH] Middleware - pas de tokens dans les cookies, redirection vers /login')
    return navigateTo('/login')
  }

  // Vérifier l'expiration du token côté serveur et client
  try {
    const payload = JSON.parse(atob(accessTokenCookie.value.split('.')[1]))
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      console.log('[AUTH] Middleware - token expiré, nettoyage et redirection')
      // Token expiré, nettoyer les cookies
      accessTokenCookie.value = null
      refreshTokenCookie.value = null
      return navigateTo('/login')
    }

    console.log('[AUTH] Middleware - token valide, accès autorisé à:', to.path)
  } catch {
    console.log('[AUTH] Middleware - token invalide, nettoyage et redirection')
    // Token malformé, nettoyer les cookies
    accessTokenCookie.value = null
    refreshTokenCookie.value = null
    return navigateTo('/login')
  }
})
