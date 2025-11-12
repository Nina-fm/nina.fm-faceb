import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { API_ENDPOINTS, type PaginatedResponse } from '~/types/api-config'
import type { Dj, DjsQueryDto } from '~/types/api/djs.types'
import type { Mixtape } from '~/types/api/mixtapes.types'
import { HttpMethod, useApi } from './api'
import { buildEndpoint, createErrorHandler, getListQueryConfig } from './apiHelpers'
import { queryKeys } from './query-keys'

/**
 * Composable pour gérer les DJs via l'API
 */
export const useDjApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  // ========================================
  // QUERIES (Lecture)
  // ========================================

  /**
   * Liste paginée des DJs avec filtres optionnels
   */
  const getDjs = (params?: MaybeRef<Partial<DjsQueryDto>>) =>
    useQuery({
      queryKey: computed(() => queryKeys.djs.list(unref(params) || {})),
      queryFn: async () => {
        const endpoint = buildEndpoint(API_ENDPOINTS.DJS.BASE, unref(params) || {})
        return call<PaginatedResponse<Dj>>(endpoint, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      ...getListQueryConfig(),
    })

  /**
   * Récupérer un DJ par ID
   */
  const getDj = (djId: MaybeRef<string>) =>
    useQuery({
      queryKey: computed(() => queryKeys.djs.detail(unref(djId))),
      queryFn: async () => {
        return call<Dj>(API_ENDPOINTS.DJS.BY_ID(unref(djId)), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(djId)),
    })

  /**
   * Récupérer les mixtapes d'un DJ
   */
  const getDjMixtapes = (djId: MaybeRef<string>) =>
    useQuery({
      queryKey: computed(() => [...queryKeys.djs.detail(unref(djId)), 'mixtapes']),
      queryFn: async () => {
        return call<{ data: Mixtape[] }>(API_ENDPOINTS.DJS.MIXTAPES(unref(djId)), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(djId)),
    })

  // ========================================
  // MUTATIONS (Écriture)
  // ========================================

  /**
   * Créer un nouveau DJ
   */
  const createDj = useMutation({
    mutationFn: async (payload: { name: string; since?: string }) =>
      call<{ data: Dj }>(API_ENDPOINTS.DJS.BASE, {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.djs.lists() })
    },
    onError: createErrorHandler('la création du DJ'),
  })

  /**
   * Mettre à jour un DJ
   */
  const updateDj = useMutation({
    mutationFn: async ({ djId, payload }: { djId: string; payload: { name?: string; since?: string } }) =>
      call<{ data: Dj }>(API_ENDPOINTS.DJS.BY_ID(djId), {
        method: HttpMethod.PATCH,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.djs.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.djs.detail(variables.djId) })
    },
    onError: createErrorHandler('la mise à jour du DJ'),
  })

  /**
   * Supprimer un DJ
   */
  const deleteDj = useMutation({
    mutationFn: async (djId: string) =>
      call(API_ENDPOINTS.DJS.BY_ID(djId), {
        method: HttpMethod.DELETE,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.djs.lists() })
    },
    onError: createErrorHandler('la suppression du DJ'),
  })

  // ========================================
  // UTILITAIRES
  // ========================================

  /**
   * Vérifier si l'utilisateur peut gérer les DJs
   */
  const canManageDjsPermission = computed(() => {
    const { canManageDJs } = usePermissions()
    return canManageDJs.value
  })

  return {
    // Queries
    getDjs,
    getDj,
    getDjMixtapes,

    // Mutations
    createDj,
    updateDj,
    deleteDj,

    // Utilitaires
    canManageDjs: canManageDjsPermission,
  }
}
