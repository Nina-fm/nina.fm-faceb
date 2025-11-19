/**
 * Middleware d'authentification
 * Protège les routes qui nécessitent une connexion et vérifie les rôles
 * Par défaut: toutes les routes nécessitent auth sauf si meta.auth = false
 */
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
  // Routes publiques (avec meta.auth = false)
  const isPublicRoute = to.meta.auth === false

  // Si route publique, laisser passer
  if (isPublicRoute) {
    return
  }

  // Côté serveur : vérifier uniquement si requiresRoles est défini
  if (import.meta.server) {
    const requiredRoles = to.meta.requiresRoles as string[] | undefined

    // Si la route nécessite des rôles spécifiques, bloquer le rendu SSR
    if (requiredRoles && requiredRoles.length > 0) {
      // Rediriger vers une page d'erreur pour éviter le flash
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès refusé',
        message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        fatal: false,
      })
    }
    return
  }

  // Côté client : vérification complète
  const { isAuthenticated, user } = useAuth()

  // Si utilisateur authentifié tente d'accéder login/register, redirect home
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }

  // Si route protégée et non authentifié, redirect login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Vérification des rôles requis
  const requiredRoles = to.meta.requiresRoles as string[] | undefined
  if (requiredRoles && requiredRoles.length > 0 && user.value) {
    const userRole = user.value.role
    const hasPermission = requiredRoles.includes(userRole)

    if (!hasPermission) {
      return abortNavigation(
        showError({
          statusCode: 403,
          statusMessage: 'Accès refusé',
          message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        }),
      )
    }
  }
})
