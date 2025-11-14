import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { API_ENDPOINTS, type PaginatedResponse } from '~/types/api-config'
import type { Mixtape } from '~/types/api/mixtapes.types'
import type { Tag, TagsQueryDto } from '~/types/api/tags.types'
import { HttpMethod, useApi } from './api'
import { buildEndpoint, createErrorHandler, getListQueryConfig } from './apiHelpers'
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
  const getTags = (params?: MaybeRef<Partial<TagsQueryDto>>) =>
    useQuery({
      queryKey: computed(() => queryKeys.tags.list(unref(params) || {})),
      queryFn: async () => {
        const endpoint = buildEndpoint(API_ENDPOINTS.TAGS.BASE, unref(params) || {})
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
        return call<{ data: Tag }>(API_ENDPOINTS.TAGS.BY_ID(unref(tagId)), {
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
  const canManageTagsPermission = computed(() => {
    const { canManageTags } = usePermissions()
    return canManageTags.value
  })

  /**
   * Vérifier si l'utilisateur peut éditer un tag spécifique
   */
  const canEditTag = (tagId: string, createdById?: string) => {
    const { isAdmin, canManageTags } = usePermissions()
    const { user } = useAuth()

    // Admin/Manager peuvent tout faire
    if (isAdmin.value || canManageTags.value) return true

    // L'utilisateur peut éditer ses propres tags
    if (createdById === user.value?.id) return true

    return false
  }

  /**
   * Vérifier si l'utilisateur peut supprimer un tag spécifique
   */
  const canDeleteTag = (tagId: string, createdById?: string) => {
    const { isAdmin, canManageTags } = usePermissions()
    const { user } = useAuth()

    // Admin/Manager peuvent tout faire
    if (isAdmin.value || canManageTags.value) return true

    // L'utilisateur peut supprimer ses propres tags
    if (createdById === user.value?.id) return true

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
    canManageTags: canManageTagsPermission,
    canEditTag,
    canDeleteTag,
  }
}
