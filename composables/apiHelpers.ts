/**
 * Helpers partagés pour les composables API
 * Factorisation du code commun
 */

interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  search?: string
  [key: string]: unknown
}

/**
 * Structure de réponse paginée standard de l'API
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext?: boolean
    hasPrev?: boolean
  }
  filters?: Record<string, unknown>
}

/**
 * Convertit les paramètres en URLSearchParams
 * Utilisé par tous les composables pour les requêtes avec pagination
 */
export const buildQueryParams = (params: PaginationParams): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString())
    }
  })

  return searchParams.toString()
}

/**
 * Construit l'endpoint avec les query parameters
 */
export const buildEndpoint = (basePath: string, params: PaginationParams): string => {
  const queryString = buildQueryParams(params)
  return queryString ? `${basePath}?${queryString}` : basePath
}

/**
 * Configuration commune pour les requêtes de liste
 */
export function getListQueryConfig() {
  return {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (anciennement cacheTime)
  }
}

/**
 * Configuration commune pour les requêtes de détail
 */
export function getDetailQueryConfig() {
  return {
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  }
}

/**
 * Créer un FormData pour l'upload de fichier
 */
export function createFileFormData(file: File, additionalFields?: Record<string, string>): FormData {
  const formData = new FormData()
  formData.append('file', file)

  if (additionalFields) {
    Object.entries(additionalFields).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  return formData
}

/**
 * Valider les types de fichiers autorisés
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Valider la taille du fichier
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

/**
 * Formater la taille d'un fichier pour l'affichage
 */
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k))

  return `${parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Handlers d'erreur standardisés
 */
export const createErrorHandler = (operation: string) => (error: unknown) => {
  console.error(`Erreur lors de ${operation}:`, error)
}

/**
 * Types génériques pour les réponses de listes
 */
export interface BaseListResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Types génériques pour les paramètres de query
 */
export interface BaseQueryParams extends PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  search?: string
}
