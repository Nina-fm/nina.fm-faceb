import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { API_ENDPOINTS } from '~/types/api-config'
import type { components } from '~/types/api/globals.types'
import { HttpMethod, useApi } from './api'
import { buildEndpoint, createErrorHandler, getListQueryConfig } from './apiHelpers'
import { queryKeys } from './query-keys'

type UsersQueryDto = components['schemas']['UsersQueryDto']
type UsersListResponseDto = components['schemas']['UsersListResponseDto']
type User = components['schemas']['User']
type UserProfile = components['schemas']['Profile']
type CreateUserDto = components['schemas']['CreateUserDto']
type UpdateUserDto = components['schemas']['UpdateUserDto']
type UpdateUserProfileDto = components['schemas']['UpdateUserProfileDto']
type UserRole = User['role']

/**
 * Composable pour gérer les utilisateurs
 * Intégration complète avec le système d'utilisateurs de l'API Nina.fm
 */
export const useUserApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  /**
   * Récupérer la liste des utilisateurs (pagination supportée)
   * Nécessite le rôle ADMIN
   */
  const getUsers = (params: Partial<UsersQueryDto> | ComputedRef<Partial<UsersQueryDto>> = {}) => {
    return useQuery({
      queryKey: computed(() => {
        const resolvedParams = unref(params)
        return queryKeys.users.list(resolvedParams)
      }),
      queryFn: async (): Promise<UsersListResponseDto> => {
        const resolvedParams = unref(params)
        const endpoint = buildEndpoint(API_ENDPOINTS.USERS.BASE, resolvedParams)

        return call<UsersListResponseDto>(endpoint, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      ...getListQueryConfig(),
    })
  }

  /**
   * Récupérer un utilisateur par ID
   * Nécessite le rôle ADMIN ou être le propriétaire
   */
  const getUser = (userId: string | ComputedRef<string>) => {
    return useQuery({
      queryKey: computed(() => queryKeys.users.detail(unref(userId))),
      queryFn: async (): Promise<{ data: User }> => {
        const id = unref(userId)
        return call<{ data: User }>(API_ENDPOINTS.USERS.BY_ID(id), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(userId)),
      ...getListQueryConfig(),
    })
  }

  /**
   * Créer un nouvel utilisateur
   * Nécessite le rôle ADMIN
   */
  const createUser = useMutation({
    mutationFn: async (payload: CreateUserDto) => {
      return call<{ data: User }>(API_ENDPOINTS.USERS.BASE, {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      })
    },
    onSuccess: () => {
      // Invalider le cache des utilisateurs
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    onError: createErrorHandler("la création de l'utilisateur"),
  })

  /**
   * Mettre à jour un utilisateur
   * Nécessite le rôle ADMIN ou être le propriétaire
   */
  const updateUser = useMutation({
    mutationFn: async ({ userId, payload }: { userId: string; payload: UpdateUserDto }) => {
      return call<{ data: User }>(API_ENDPOINTS.USERS.BY_ID(userId), {
        method: HttpMethod.PATCH,
        body: payload,
        requireAuth: true,
      })
    },
    onSuccess: (response) => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(response.data.id) })
    },
    onError: createErrorHandler("la mise à jour de l'utilisateur"),
  })

  /**
   * Mettre à jour le profil d'un utilisateur
   * Nécessite le rôle ADMIN ou être le propriétaire
   */
  const updateUserProfile = useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string
      payload: UpdateUserProfileDto
    }): Promise<UserProfile> => {
      return call<UserProfile>(API_ENDPOINTS.USERS.PROFILE(userId), {
        method: HttpMethod.PATCH,
        body: payload,
        requireAuth: true,
      })
    },
    onSuccess: (_, { userId }) => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(userId) })
    },
    onError: createErrorHandler('la mise à jour du profil'),
  })

  /**
   * Supprimer un utilisateur
   * Nécessite le rôle ADMIN
   */
  const deleteUser = useMutation({
    mutationFn: async (userId: string): Promise<{ success: boolean }> => {
      return call<{ success: boolean }>(API_ENDPOINTS.USERS.BY_ID(userId), {
        method: HttpMethod.DELETE,
        requireAuth: true,
      })
    },
    onSuccess: () => {
      // Invalider le cache des utilisateurs
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    onError: createErrorHandler("la suppression de l'utilisateur"),
  })

  /**
   * Utility: Vérifier si l'utilisateur actuel peut gérer les utilisateurs
   */
  const canManageUsers = computed(() => {
    const { userRole } = useAuth()
    return userRole.value === 'ADMIN'
  })

  /**
   * Utility: Vérifier si l'utilisateur actuel peut éditer un utilisateur spécifique
   */
  const canEditUser = (userId: string) => {
    const { userRole, user } = useAuth()
    return userRole.value === 'ADMIN' || user.value?.id === userId
  }

  /**
   * Utility: Formater le rôle d'un utilisateur pour l'affichage
   */
  const getUserRoleLabel = (role: UserRole): string => {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur'
      case 'MANAGER':
        return 'Gestionnaire'
      case 'CONTRIBUTOR':
        return 'Contributeur'
      case 'VIEWER':
        return 'Observateur'
      default:
        return 'Inconnu'
    }
  }

  /**
   * Utility: Obtenir la couleur CSS pour le rôle
   */
  const getUserRoleColor = (role: UserRole): string => {
    switch (role) {
      case 'ADMIN':
        return 'text-purple-600 bg-purple-100'
      case 'MANAGER':
        return 'text-indigo-600 bg-indigo-100'
      case 'CONTRIBUTOR':
        return 'text-blue-600 bg-blue-100'
      case 'VIEWER':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return {
    // Queries
    getUsers,
    getUser,

    // Mutations
    createUser,
    updateUser,
    updateUserProfile,
    deleteUser,

    // Utilities
    canManageUsers,
    canEditUser,
    getUserRoleLabel,
    getUserRoleColor,
  }
}
