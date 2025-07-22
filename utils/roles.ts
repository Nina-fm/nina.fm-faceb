/**
 * Utilitaires pour la gestion des rôles
 */

// Enum des rôles disponibles
export const Role = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  VIEWER: 'VIEWER',
  USER: 'USER',
} as const

export type RoleType = (typeof Role)[keyof typeof Role]

// Fonction helper pour vérifier les rôles
export const isRole = (role: string): role is RoleType => {
  return Object.values(Role).includes(role as RoleType)
}

// Export par défaut pour usage facile
export default Role
