/**
 * Composable pour la gestion des permissions utilisateur
 * Intégré avec le store auth et la logique de rôles
 */
export const usePermissions = () => {
  const authStore = useAuthStore()
  const { hasRole, hasAnyRole } = useRoles()

  // États réactifs des permissions
  const isAdmin = computed(() => hasRole(authStore.userRole || '', 'ADMIN'))
  const isManager = computed(() => hasRole(authStore.userRole || '', 'MANAGER'))
  const isContributor = computed(() => hasRole(authStore.userRole || '', 'CONTRIBUTOR'))
  const isViewer = computed(() => hasRole(authStore.userRole || '', 'VIEWER'))
  const isGuest = computed(() => !authStore.user || !authStore.userRole)

  // Permissions granulaires
  const canManageUsers = computed(() => isAdmin.value)
  const canManageMixtapes = computed(() => isAdmin.value || isManager.value)
  const canManageDJs = computed(() => isAdmin.value || isManager.value)
  const canManageTags = computed(() => isAdmin.value || isManager.value)
  const canUploadImages = computed(() => isAdmin.value || isManager.value || isContributor.value)
  const canViewBackoffice = computed(() => isAdmin.value || isManager.value || isContributor.value)

  // Fonctions utilitaires
  const checkRole = (requiredRole: string): boolean => {
    return hasRole(authStore.userRole || '', requiredRole)
  }

  const checkAnyRole = (requiredRoles: string[]): boolean => {
    return hasAnyRole(authStore.userRole || '', requiredRoles)
  }

  const requireRole = (requiredRole: string, errorMessage?: string): void => {
    if (!checkRole(requiredRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: errorMessage || `Accès non autorisé - Rôle ${requiredRole} requis`,
      })
    }
  }

  const requireAnyRole = (requiredRoles: string[], errorMessage?: string): void => {
    if (!checkAnyRole(requiredRoles)) {
      throw createError({
        statusCode: 403,
        statusMessage:
          errorMessage || `Accès non autorisé - Un des rôles suivants requis : ${requiredRoles.join(', ')}`,
      })
    }
  }

  // Messages d'erreur contextuels
  const getPermissionErrorMessage = (action: string): string => {
    if (isGuest.value) {
      return 'Vous devez être connecté pour effectuer cette action'
    }

    switch (authStore.userRole) {
      case 'VIEWER':
        return `Action non autorisée - Permissions insuffisantes pour : ${action}`
      case 'CONTRIBUTOR':
        return `Action réservée aux gestionnaires ou administrateurs : ${action}`
      case 'MANAGER':
        return `Action réservée aux administrateurs : ${action}`
      default:
        return `Permissions insuffisantes pour : ${action}`
    }
  }

  return {
    // États des rôles
    isAdmin,
    isManager,
    isContributor,
    isViewer,
    isGuest,

    // Permissions granulaires
    canManageUsers,
    canManageMixtapes,
    canManageDJs,
    canManageTags,
    canUploadImages,
    canViewBackoffice,

    // Fonctions de vérification
    checkRole,
    checkAnyRole,
    requireRole,
    requireAnyRole,

    // Utilitaires
    getPermissionErrorMessage,
    currentRole: computed(() => authStore.userRole),
  }
}
