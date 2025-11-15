/**
 * Middleware d'authentification
 * Protège les routes qui nécessitent une connexion et vérifie les rôles
 * Par défaut: toutes les routes nécessitent auth sauf si meta.auth = false
 */
export default defineNuxtRouteMiddleware((to) => {
  // Ne pas traiter les routes API (appels internes)
  if (to.path.startsWith('/api')) {
    return
  }

  // Skip server-side execution - auth is client-only
  if (import.meta.server) {
    return
  }

  const { isAuthenticated, isAuthLoading, userRole } = useAuth()

  // Wait for auth to finish loading on client-side
  if (isAuthLoading.value) {
    // Auth still loading, don't redirect yet
    return
  }

  // Routes publiques (avec meta.auth = false)
  const isPublicRoute = to.meta.auth === false

  // Si utilisateur authentifié tente d'accéder login/register, redirect home
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }

  // Si route publique, laisser passer
  if (isPublicRoute) {
    return
  }

  // Si route protégée et non authentifié, redirect login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Vérification des rôles requis (si définis dans meta.roles)
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    const { hasAnyRole } = useRoles()
    const hasPermission = hasAnyRole(userRole.value || '', requiredRoles)

    if (!hasPermission) {
      // L'utilisateur n'a pas les permissions nécessaires
      console.warn(
        `Accès refusé à ${to.path}: rôle requis ${requiredRoles.join(' ou ')}, rôle actuel: ${userRole.value}`,
      )

      // Rediriger vers la page d'accueil avec un message d'erreur
      return navigateTo('/')
    }
  }
})
