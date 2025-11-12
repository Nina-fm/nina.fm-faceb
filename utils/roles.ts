/**
 * Utilitaires pour la gestion des rôles
 * @deprecated Use UserRole from '~/types/api/users.types' instead
 * This file is kept for backward compatibility but should be replaced
 */

// Re-export from API-generated types
export { UserRole as Role, USER_ROLES } from '~/types/api/users.types'
export type { Role as RoleType } from '~/types/api/users.types'

// Export par défaut pour usage facile (deprecated)
export { UserRole as default } from '~/types/api/users.types'

/**
 * Type guard to check if a string is a valid Role
 * Auto-synced with API-generated roles
 */
export const isRole = (role: string): role is RoleType => {
  return USER_ROLES.includes(role as RoleType)
}
