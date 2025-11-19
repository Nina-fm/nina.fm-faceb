/**
 * Composable pour la gestion des permissions utilisateur
 * Intégré avec useAuth et la logique de rôles
 */
export const usePermissions = () => {
  const { user, userRole } = useAuth()
  const { hasRole, hasAnyRole } = useRoles()

  // États réactifs des permissions
  const isAdmin = computed(() => hasRole(userRole.value || '', 'ADMIN'))
  const isManager = computed(() => hasRole(userRole.value || '', 'MANAGER'))
  const isContributor = computed(() => hasRole(userRole.value || '', 'CONTRIBUTOR'))
  const isViewer = computed(() => hasRole(userRole.value || '', 'VIEWER'))
  const isGuest = computed(() => !user.value || !userRole.value)

  // Permissions granulaires
  const canManageUsers = computed(() => isAdmin.value)
  const canManageMixtapes = computed(() => isAdmin.value || isManager.value)
  const canManageDJs = computed(() => isAdmin.value || isManager.value)
  const canManageTags = computed(() => isAdmin.value || isManager.value)
  const canUploadImages = computed(() => isAdmin.value || isManager.value || isContributor.value)
  const canViewBackoffice = computed(() => isAdmin.value || isManager.value || isContributor.value || isViewer.value)

  // Permissions de création (incluent CONTRIBUTOR)
  const canCreateMixtape = computed(() => isAdmin.value || isManager.value || isContributor.value)
  const canCreateTag = computed(() => isAdmin.value || isManager.value || isContributor.value)

  // Fonctions utilitaires
  const checkRole = (requiredRole: string): boolean => {
    return hasRole(userRole.value || '', requiredRole)
  }

  const checkAnyRole = (requiredRoles: string[]): boolean => {
    return hasAnyRole(userRole.value || '', requiredRoles)
  }

  /**
   * Vérifier si l'utilisateur peut accéder à une ressource
   * Soit il a le rôle requis, soit il est propriétaire de la ressource
   */
  const canAccessResource = (ownerId: string | undefined, requiredRole: string): boolean => {
    if (!user.value?.id) return false

    // Si c'est le propriétaire, accès autorisé
    if (ownerId === user.value.id) return true

    // Sinon vérifier le rôle
    return checkRole(requiredRole)
  }

  /**
   * Vérifier si l'utilisateur peut modifier une ressource
   * Soit il a le rôle MANAGER+, soit il est propriétaire
   */
  const canEditResource = (ownerId: string | undefined): boolean => {
    return canAccessResource(ownerId, 'MANAGER')
  }

  /**
   * Vérifier si l'utilisateur peut supprimer une ressource
   * Soit il a le rôle MANAGER+, soit il est propriétaire
   */
  const canDeleteResource = (ownerId: string | undefined): boolean => {
    return canAccessResource(ownerId, 'MANAGER')
  }

  /**
   * Vérifier si l'utilisateur peut éditer/supprimer un autre utilisateur
   * - ADMIN : peut modifier tous les utilisateurs
   * - MANAGER : peut modifier uniquement VIEWER et CONTRIBUTOR (pas ADMIN ni MANAGER)
   */
  const canEditUser = (targetUserRole: string): boolean => {
    if (!user.value) return false

    // ADMIN peut tout faire
    if (isAdmin.value) return true

    // MANAGER peut uniquement modifier VIEWER et CONTRIBUTOR
    if (isManager.value) {
      return targetUserRole === 'VIEWER' || targetUserRole === 'CONTRIBUTOR'
    }

    return false
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

    switch (userRole.value) {
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

    // Permissions de création
    canCreateMixtape,
    canCreateTag,

    // Fonctions de vérification
    checkRole,
    checkAnyRole,
    requireRole,
    requireAnyRole,

    // Ownership & ressources
    canAccessResource,
    canEditResource,
    canDeleteResource,
    canEditUser,

    // Utilitaires
    getPermissionErrorMessage,
    currentRole: userRole,
  }
}
