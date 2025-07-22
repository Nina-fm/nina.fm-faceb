/**
 * Query Keys standardisées pour TanStack Query
 * Permet une gestion cohérente du cache et de l'invalidation
 */

// Types pour les paramètres des queries
interface UserQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
}

interface DjQueryParams {
  page?: number
  limit?: number
  search?: string
}

interface TagQueryParams {
  page?: number
  limit?: number
  search?: string
}

interface MixtapeQueryParams {
  page?: number
  limit?: number
  search?: string
  tag?: string
  dj?: string
}

interface InvitationQueryParams {
  page?: number
  limit?: number
  status?: 'pending' | 'used' | 'expired'
  search?: string
}

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Users queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: UserQueryParams) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: (id: string) => [...queryKeys.users.all, 'profile', id] as const,
  },

  // DJs queries
  djs: {
    all: ['djs'] as const,
    lists: () => [...queryKeys.djs.all, 'list'] as const,
    list: (params?: DjQueryParams) => [...queryKeys.djs.lists(), params] as const,
    details: () => [...queryKeys.djs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.djs.details(), id] as const,
  },

  // Tags queries
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
    list: (params?: TagQueryParams) => [...queryKeys.tags.lists(), params] as const,
    details: () => [...queryKeys.tags.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tags.details(), id] as const,
  },

  // Mixtapes queries
  mixtapes: {
    all: ['mixtapes'] as const,
    lists: () => [...queryKeys.mixtapes.all, 'list'] as const,
    list: (params?: MixtapeQueryParams) => [...queryKeys.mixtapes.lists(), params] as const,
    details: () => [...queryKeys.mixtapes.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.mixtapes.details(), id] as const,
  },

  // Images queries
  images: {
    all: ['images'] as const,
    detail: (id: string) => [...queryKeys.images.all, id] as const,
  },

  // Invitations queries
  invitations: {
    all: ['invitations'] as const,
    lists: () => [...queryKeys.invitations.all, 'list'] as const,
    list: (params?: InvitationQueryParams) => [...queryKeys.invitations.lists(), params] as const,
    details: () => [...queryKeys.invitations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.invitations.details(), id] as const,
    validate: (token: string) => [...queryKeys.invitations.all, 'validate', token] as const,
  },
} as const

export type QueryKeys = typeof queryKeys
