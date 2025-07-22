/**
 * Composable pour la gestion des rôles utilisateur
 */
export const useRoles = () => {
  const { hasRole: utilHasRole, hasAnyRole: utilHasAnyRole } = useRolesUtil()

  return {
    hasRole: (userRole: string | undefined, requiredRole: string): boolean => {
      if (!userRole) return false
      return utilHasRole(userRole, requiredRole)
    },

    hasAnyRole: (userRole: string | undefined, requiredRoles: string[]): boolean => {
      if (!userRole) return false
      return utilHasAnyRole(userRole, requiredRoles)
    },
  }
}

/**
 * Utilitaires pour les rôles (importés depuis utils/roles.ts)
 */
const useRolesUtil = () => {
  const { hasRole, hasAnyRole } = useImportedRoles()

  return {
    hasRole,
    hasAnyRole,
  }
}

/**
 * Import des utilitaires de rôles
 */
const useImportedRoles = () => {
  return {
    hasRole: (userRole: string, requiredRole: string): boolean => {
      const roleHierarchy = ['VIEWER', 'CONTRIBUTOR', 'MANAGER', 'ADMIN']
      const userRoleIndex = roleHierarchy.indexOf(userRole)
      const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

      return userRoleIndex >= requiredRoleIndex && userRoleIndex !== -1 && requiredRoleIndex !== -1
    },

    hasAnyRole: (userRole: string, requiredRoles: string[]): boolean => {
      return requiredRoles.some((role) => {
        const roleHierarchy = ['VIEWER', 'CONTRIBUTOR', 'MANAGER', 'ADMIN']
        const userRoleIndex = roleHierarchy.indexOf(userRole)
        const requiredRoleIndex = roleHierarchy.indexOf(role)

        return userRoleIndex >= requiredRoleIndex && userRoleIndex !== -1 && requiredRoleIndex !== -1
      })
    },
  }
}
