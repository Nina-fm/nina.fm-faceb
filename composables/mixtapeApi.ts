import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { API_ENDPOINTS, type PaginatedResponse } from '~/types/api-config'
import type { operations } from '~/types/api/globals.types'
import type { CreateMixtapeDto, Mixtape, MixtapesQueryDto, UpdateMixtapeDto } from '~/types/api/mixtapes.types'
import { HttpMethod, useApi } from './api'
import { buildEndpoint, createErrorHandler, getListQueryConfig } from './apiHelpers'
import { queryKeys } from './query-keys'

// Type pour la réponse de getAvailableYears
type GetAvailableYearsResponse =
  operations['MixtapesController_getAvailableYears']['responses'][200]['content']['application/json']

/**
 * Composable pour gérer les Mixtapes via l'API
 */
export const useMixtapeApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  // ========================================
  // QUERIES (Lecture)
  // ========================================

  /**
   * Liste paginée des mixtapes avec filtres optionnels
   */
  const getMixtapes = (params?: MaybeRef<Partial<MixtapesQueryDto>>) =>
    useQuery({
      queryKey: computed(() => queryKeys.mixtapes.list(unref(params) || {})),
      queryFn: async () => {
        const endpoint = buildEndpoint(API_ENDPOINTS.MIXTAPES.BASE, unref(params) || {})
        return call<PaginatedResponse<Mixtape>>(endpoint, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      ...getListQueryConfig(),
    })

  /**
   * Récupérer une mixtape par ID
   */
  const getMixtape = (mixtapeId: MaybeRef<string>) =>
    useQuery({
      queryKey: computed(() => queryKeys.mixtapes.detail(unref(mixtapeId))),
      queryFn: async () => {
        return call<{ data: Mixtape }>(API_ENDPOINTS.MIXTAPES.BY_ID(unref(mixtapeId)), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(mixtapeId)),
    })

  /**
   * Récupérer toutes les années disponibles
   */
  const getAvailableYears = () =>
    useQuery({
      queryKey: ['mixtapes', 'years'] as const,
      queryFn: async () => {
        return call<GetAvailableYearsResponse>(API_ENDPOINTS.MIXTAPES.YEARS, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      ...getListQueryConfig(),
    })

  // ========================================
  // MUTATIONS (Écriture)
  // ========================================

  /**
   * Créer une nouvelle mixtape
   */
  const createMixtape = useMutation({
    mutationFn: async (payload: CreateMixtapeDto) =>
      call<Mixtape>(API_ENDPOINTS.MIXTAPES.BASE, {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mixtapes.lists() })
    },
    onError: createErrorHandler('la création de la mixtape'),
  })

  /**
   * Mettre à jour une mixtape
   */
  const updateMixtape = useMutation({
    mutationFn: async ({ mixtapeId, payload }: { mixtapeId: string; payload: UpdateMixtapeDto }) =>
      call<{ data: Mixtape }>(API_ENDPOINTS.MIXTAPES.BY_ID(mixtapeId), {
        method: HttpMethod.PATCH,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mixtapes.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.mixtapes.detail(variables.mixtapeId) })
    },
    onError: createErrorHandler('la mise à jour de la mixtape'),
  })

  /**
   * Supprimer une mixtape
   */
  const deleteMixtape = useMutation({
    mutationFn: async (mixtapeId: string) =>
      call(API_ENDPOINTS.MIXTAPES.BY_ID(mixtapeId), {
        method: HttpMethod.DELETE,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mixtapes.lists() })
    },
    onError: createErrorHandler('la suppression de la mixtape'),
  })

  // ========================================
  // UTILITAIRES
  // ========================================

  /**
   * Vérifier si l'utilisateur peut gérer les mixtapes
   */
  const canManageMixtapesPermission = computed(() => {
    const { canManageMixtapes } = usePermissions()
    return canManageMixtapes.value
  })

  return {
    // Queries
    getMixtapes,
    getMixtape,
    getAvailableYears,

    // Mutations
    createMixtape,
    updateMixtape,
    deleteMixtape,

    // Utilitaires
    canManageMixtapes: canManageMixtapesPermission,
  }
}
