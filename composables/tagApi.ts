import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { TagsQueryDto } from '~/types/api'
import { API_ENDPOINTS } from '~/types/api-config'
import type { Mixtape, Tag } from '~/types/db'
import { HttpMethod, useApi } from './api'
import { buildEndpoint, createErrorHandler, getListQueryConfig, type PaginatedResponse } from './apiHelpers'
import { queryKeys } from './query-keys'

/**
 * Composable pour gérer les Tags via l'API
 */
export const useTagApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  // ========================================
  // QUERIES (Lecture)
  // ========================================

  /**
   * Liste paginée des tags avec filtres optionnels
   */
  const getTags = (params: MaybeRef<TagsQueryDto> = {}) =>
    useQuery({
      queryKey: computed(() => queryKeys.tags.list(unref(params))),
      queryFn: async () => {
        const endpoint = buildEndpoint(API_ENDPOINTS.TAGS.BASE, unref(params))
        return call<PaginatedResponse<Tag>>(endpoint, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      ...getListQueryConfig(),
    })

  /**
   * Récupérer un tag par ID
   */
  const getTag = (tagId: MaybeRef<string>) =>
    useQuery({
      queryKey: computed(() => queryKeys.tags.detail(unref(tagId))),
      queryFn: async () => {
        return call<Tag>(API_ENDPOINTS.TAGS.BY_ID(unref(tagId)), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(tagId)),
    })

  /**
   * Récupérer les mixtapes d'un tag
   */
  const getTagMixtapes = (tagId: MaybeRef<string>) =>
    useQuery({
      queryKey: computed(() => [...queryKeys.tags.detail(unref(tagId)), 'mixtapes']),
      queryFn: async () => {
        return call<{ data: Mixtape[] }>(API_ENDPOINTS.TAGS.MIXTAPES(unref(tagId)), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(tagId)),
    })

  // ========================================
  // MUTATIONS (Écriture)
  // ========================================

  /**
   * Créer un nouveau tag
   */
  const createTag = useMutation({
    mutationFn: async (payload: { name: string; color?: string }) =>
      call<{ data: Tag }>(API_ENDPOINTS.TAGS.BASE, {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() })
    },
    onError: createErrorHandler('la création du tag'),
  })

  /**
   * Mettre à jour un tag
   */
  const updateTag = useMutation({
    mutationFn: async ({ tagId, payload }: { tagId: string; payload: { name?: string; color?: string } }) =>
      call<{ data: Tag }>(API_ENDPOINTS.TAGS.BY_ID(tagId), {
        method: HttpMethod.PATCH,
        body: payload,
        requireAuth: true,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.detail(variables.tagId) })
    },
    onError: createErrorHandler('la mise à jour du tag'),
  })

  /**
   * Supprimer un tag
   */
  const deleteTag = useMutation({
    mutationFn: async (tagId: string) =>
      call(API_ENDPOINTS.TAGS.BY_ID(tagId), {
        method: HttpMethod.DELETE,
        requireAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.lists() })
    },
    onError: createErrorHandler('la suppression du tag'),
  })

  // ========================================
  // UTILITAIRES
  // ========================================

  /**
   * Vérifier si l'utilisateur peut gérer les tags
   */
  const canManageTags = computed(() => {
    const { hasPermission } = usePermissions()
    return hasPermission('CREATE_TAG') || hasPermission('UPDATE_ANY_TAG') || hasPermission('DELETE_ANY_TAG')
  })

  /**
   * Vérifier si l'utilisateur peut éditer un tag spécifique
   */
  const canEditTag = (tagId: string, createdById?: string) => {
    const { hasPermission, user } = usePermissions()

    // Admin peut tout faire
    if (hasPermission('UPDATE_ANY_TAG')) return true

    // L'utilisateur peut éditer ses propres tags
    if (hasPermission('UPDATE_OWN_TAG') && createdById === user.value?.id) return true

    return false
  }

  /**
   * Vérifier si l'utilisateur peut supprimer un tag spécifique
   */
  const canDeleteTag = (tagId: string, createdById?: string) => {
    const { hasPermission, user } = usePermissions()

    // Admin peut tout faire
    if (hasPermission('DELETE_ANY_TAG')) return true

    // L'utilisateur peut supprimer ses propres tags
    if (hasPermission('DELETE_OWN_TAG') && createdById === user.value?.id) return true

    return false
  }

  return {
    // Queries
    getTags,
    getTag,
    getTagMixtapes,

    // Mutations
    createTag,
    updateTag,
    deleteTag,

    // Utilitaires
    canManageTags,
    canEditTag,
    canDeleteTag,
  }
}
