/**
 * Middleware d'authentification
 * Protège les routes qui nécessitent une connexion
 * Par défaut: toutes les routes nécessitent auth sauf si meta.auth = false
 */
export default defineNuxtRouteMiddleware((to) => {
  // Ne pas traiter les routes API (appels internes)
  if (to.path.startsWith('/api')) {
    return
  }

  const { isAuthenticated, user } = useAuth()

  // Debug logs
  console.log('[AUTH MIDDLEWARE]', {
    path: to.path,
    isAuthenticated: isAuthenticated.value,
    hasUser: !!user.value,
    userId: user.value?.id,
    metaAuth: to.meta.auth,
  })

  // Routes publiques (avec meta.auth = false)
  const isPublicRoute = to.meta.auth === false

  // Si utilisateur authentifié tente d'accéder login/register, redirect home
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    console.log('[AUTH MIDDLEWARE] Redirecting authenticated user from login/register to /')
    return navigateTo('/')
  }

  // Si route publique, laisser passer
  if (isPublicRoute) {
    console.log('[AUTH MIDDLEWARE] Public route, allowing')
    return
  }

  // Si route protégée et non authentifié, redirect login
  if (!isAuthenticated.value) {
    console.log('[AUTH MIDDLEWARE] Not authenticated, redirecting to /login')
    return navigateTo('/login')
  }

  console.log('[AUTH MIDDLEWARE] Authenticated, allowing')
})
