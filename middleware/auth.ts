/**
 * Middleware d'authentification
 * Protège les routes qui nécessitent une connexion
 * Par défaut: toutes les routes nécessitent auth sauf si meta.auth = false
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // Routes publiques (avec meta.auth = false)
  const isPublicRoute = to.meta.auth === false

  // Si route publique, laisser passer
  if (isPublicRoute) {
    return
  }

  // Si route protégée et non authentifié, redirect login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
