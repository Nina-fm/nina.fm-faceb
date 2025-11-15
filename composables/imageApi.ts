import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { API_ENDPOINTS } from '~/types/api-config'
import type { components } from '~/types/api/globals.types'
import { HttpMethod, useApi } from './api'
import {
  createErrorHandler,
  createFileFormData,
  formatFileSize,
  getListQueryConfig,
  validateFileSize,
  validateFileType,
} from './apiHelpers'
import { queryKeys } from './query-keys'

type ImageFile = components['schemas']['ImageFile']

/**
 * Composable pour gérer les images
 * Intégration complète avec le système d'images de l'API Nina.fm
 */
export const useImageApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  // Configuration des types et tailles autorisés
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const MAX_FILE_SIZE_MB = 10

  /**
   * Récupérer une image par ID
   * Nécessite l'authentification
   */
  const getImage = (imageId: string | ComputedRef<string>) => {
    return useQuery({
      queryKey: computed(() => queryKeys.images.detail(unref(imageId))),
      queryFn: async (): Promise<ImageFile> => {
        const id = unref(imageId)
        return call<ImageFile>(API_ENDPOINTS.IMAGE_FILES.METADATA(id), {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      enabled: computed(() => !!unref(imageId)),
      ...getListQueryConfig(),
    })
  }

  /**
   * Uploader une image
   * Nécessite l'authentification
   */
  const uploadImage = useMutation({
    mutationFn: async ({
      file,
      bucket = 'web',
    }: {
      file: File
      bucket?: 'covers' | 'avatars' | 'web'
    }): Promise<ImageFile> => {
      // Validation côté client
      if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
        throw new Error(`Type de fichier non autorisé. Types acceptés: ${ALLOWED_IMAGE_TYPES.join(', ')}`)
      }

      if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
        throw new Error(`Fichier trop volumineux. Taille maximum: ${MAX_FILE_SIZE_MB}MB`)
      }

      const formData = createFileFormData(file, { bucket })

      return call<ImageFile>(API_ENDPOINTS.IMAGE_FILES.UPLOAD, {
        method: HttpMethod.POST,
        body: formData,
        requireAuth: true,
      })
    },
    onSuccess: () => {
      // Invalider le cache des images
      queryClient.invalidateQueries({ queryKey: queryKeys.images.all })
    },
    onError: createErrorHandler("l'upload de l'image"),
  })

  /**
   * Supprimer une image
   * Nécessite l'authentification
   */
  const deleteImage = useMutation({
    mutationFn: async (imageId: string): Promise<{ success: boolean }> => {
      return call<{ success: boolean }>(API_ENDPOINTS.IMAGE_FILES.BY_ID(imageId), {
        method: HttpMethod.DELETE,
        requireAuth: true,
      })
    },
    onSuccess: (_, imageId) => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: queryKeys.images.all })
      queryClient.removeQueries({ queryKey: queryKeys.images.detail(imageId) })
    },
    onError: createErrorHandler("la suppression de l'image"),
  })

  /**
   * Utility: Générer l'URL de l'image originale
   */
  const getImageUrl = (image?: ImageFile): string | null => {
    if (!image?.id) return null

    const config = useRuntimeConfig()
    const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'
    return `${baseURL}/files/images/${image.id}`
  }

  /**
   * Utility: Générer l'URL de la miniature
   */
  const getThumbnailUrl = (image?: ImageFile): string | null => {
    if (!image?.id) return null

    const config = useRuntimeConfig()
    const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'
    return `${baseURL}/files/images/${image.id}/thumbnail`
  }

  /**
   * Utility: Générer l'URL de l'image par ID
   */
  const getImageUrlById = (imageId: string): string => {
    const config = useRuntimeConfig()
    const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'
    return `${baseURL}/files/images/${imageId}`
  }

  /**
   * Utility: Générer l'URL de la miniature par ID
   */
  const getThumbnailUrlById = (imageId: string): string => {
    const config = useRuntimeConfig()
    const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'
    return `${baseURL}/files/images/${imageId}/thumbnail`
  }

  /**
   * Utility: Créer une URL temporaire pour prévisualiser un fichier
   */
  const generateTmpImageUrl = (file: Blob): string => {
    const src = URL.createObjectURL(file)
    setTimeout(() => {
      URL.revokeObjectURL(src)
    }, 1000)
    return src
  }

  /**
   * Utility: Formater les informations d'une image
   */
  const getImageInfo = (image: ImageFile) => {
    return {
      dimensions: `${image.width} × ${image.height}`,
      size: formatFileSize(image.size),
      type: image.mimeType,
      ratio: (image.width / image.height).toFixed(2),
    }
  }

  /**
   * Utility: Vérifier si un fichier est une image valide
   */
  const isValidImageFile = (file: File): { valid: boolean; error?: string } => {
    if (!validateFileType(file, ALLOWED_IMAGE_TYPES)) {
      return {
        valid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      }
    }

    if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
      return {
        valid: false,
        error: `Fichier trop volumineux. Taille maximum: ${MAX_FILE_SIZE_MB}MB (actuel: ${formatFileSize(file.size)})`,
      }
    }

    return { valid: true }
  }

  return {
    // Queries
    getImage,

    // Mutations
    uploadImage,
    deleteImage,

    // Utilities
    getImageUrl,
    getThumbnailUrl,
    getImageUrlById,
    getThumbnailUrlById,
    generateTmpImageUrl,
    getImageInfo,
    isValidImageFile,

    // Constants
    ALLOWED_IMAGE_TYPES,
    MAX_FILE_SIZE_MB,
  }
}
