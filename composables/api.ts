import type { FetchOptions } from 'ofetch'
import { API_CONFIG, API_ENDPOINTS } from '~/types/api-config'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface ApiRequestOptions extends Omit<FetchOptions, 'method' | 'baseURL'> {
  method?: HttpMethod
  requireAuth?: boolean
  timeout?: number
}

export interface ApiError extends Error {
  statusCode?: number
  data?: any
}

/**
 * Composable pour gérer les appels API vers Nina.fm API
 */
export const useApi = () => {
  const config = useRuntimeConfig()

  // Récupération du token depuis le store auth
  const authStore = useAuthStore()
  const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'

  /**
   * Fonction générique pour effectuer des appels API
   */
  const call = async <T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
    const {
      method = HttpMethod.GET,
      requireAuth = true,
      timeout = API_CONFIG.REQUEST_TIMEOUT,
      headers = {},
      ...fetchOptions
    } = options

    // Préparation des headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    }

    // Ajout du token d'authentification si requis
    if (requireAuth && authStore.accessToken) {
      ;(requestHeaders as Record<string, string>).Authorization = `Bearer ${authStore.accessToken}`
    }

    try {
      const response = (await $fetch(endpoint, {
        ...fetchOptions,
        method,
        baseURL,
        headers: requestHeaders,
        timeout,
        onRequest({ request, options }) {
          // Log des requêtes en développement
          if (import.meta.dev) {
            console.log(`[API] ${method} ${request}`)
          }
        },
        onRequestError({ error }) {
          console.error('[API] Request Error:', error)
        },
        onResponseError({ response }) {
          console.error('[API] Response Error:', response.status, response._data)

          // Gestion des erreurs d'authentification
          // Attention: Ne pas déclencher le refresh pour les endpoints d'auth eux-mêmes
          if (response.status === 401 && !endpoint.includes('/auth/')) {
            console.log('[API] Token expiré détecté sur:', endpoint, '- déclenchement handleTokenExpired')
            // Token expiré, tentative de refresh
            authStore.handleTokenExpired()
          }
        },
      })) as T

      return response
    } catch (error: any) {
      // Transformation de l'erreur pour l'interface utilisateur
      const apiError: ApiError = new Error(error?.data?.message || error?.message || 'Une erreur est survenue')
      apiError.statusCode = error?.status || error?.statusCode
      apiError.data = error?.data

      throw apiError
    }
  }

  // Méthodes de convenance pour les différents types de requêtes
  const get = <T = any>(endpoint: string, options?: ApiRequestOptions) =>
    call<T>(endpoint, { ...options, method: HttpMethod.GET })

  const post = <T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
    call<T>(endpoint, { ...options, method: HttpMethod.POST, body })

  const put = <T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
    call<T>(endpoint, { ...options, method: HttpMethod.PUT, body })

  const patch = <T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) =>
    call<T>(endpoint, { ...options, method: HttpMethod.PATCH, body })

  const del = <T = any>(endpoint: string, options?: ApiRequestOptions) =>
    call<T>(endpoint, { ...options, method: HttpMethod.DELETE })

  // Upload de fichiers
  const upload = async (file: File, endpoint: string = API_ENDPOINTS.IMAGES.UPLOAD) => {
    const formData = new FormData()
    formData.append('file', file)

    return await call<FileUploadResponse>(endpoint, {
      method: HttpMethod.POST,
      body: formData,
      headers: {}, // Ne pas définir Content-Type pour FormData
    })
  }

  return {
    call,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,

    // Endpoints pré-configurés
    endpoints: API_ENDPOINTS,
    config: API_CONFIG,
  }
}
