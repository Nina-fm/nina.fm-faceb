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
  data?: unknown
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
  const call = async <T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
    const {
      method = HttpMethod.GET,
      requireAuth = true,
      timeout = API_CONFIG.REQUEST_TIMEOUT,
      headers = {},
      ...fetchOptions
    } = options

    // Préparation des headers
    // Ne pas forcer Content-Type pour FormData (le navigateur doit définir le boundary)
    const requestHeaders: HeadersInit = {
      ...(!(fetchOptions.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...headers,
    }

    // Ajout du token d'authentification si requis
    if (requireAuth && authStore.accessToken) {
      ;(requestHeaders as Record<string, string>).Authorization = `Bearer ${authStore.accessToken}`
    }

    try {
      const fetchConfig: Record<string, unknown> = {
        ...fetchOptions,
        method,
        baseURL,
        headers: requestHeaders,
        timeout,
        onRequest(context: { request: RequestInfo }) {
          // Log des requêtes en développement
          if (import.meta.dev) {
            console.log(`[API] ${method} ${context.request}`)
          }
        },
        onRequestError(context: { error: unknown }) {
          console.error('[API] Request Error:', context.error)
        },
        onResponseError(context: { response: { status: number; _data: unknown } }) {
          console.error('[API] Response Error:', context.response.status, context.response._data)

          // Gestion des erreurs d'authentification
          // Attention: Ne pas déclencher le refresh pour les endpoints d'auth eux-mêmes
          if (context.response.status === 401 && !endpoint.includes('/auth/')) {
            console.log('[API] Token expiré détecté sur:', endpoint, '- déclenchement handleTokenExpired')
            // Token expiré, tentative de refresh
            authStore.handleTokenExpired()
          }
        },
      }

      // Utilisation de l'assertion de type pour contourner les conflits de types complexes de Nuxt
      const response = await ($fetch as (url: string, opts?: Record<string, unknown>) => Promise<T>)(
        endpoint,
        fetchConfig,
      )
      return response
    } catch (error: unknown) {
      // Transformation de l'erreur pour l'interface utilisateur
      const errorObj = error as Record<string, unknown>
      const apiError: ApiError = new Error(
        ((errorObj?.data as Record<string, unknown>)?.message as string) ||
          (errorObj?.message as string) ||
          'Une erreur est survenue',
      )
      apiError.statusCode = (errorObj?.status || errorObj?.statusCode) as number
      apiError.data = errorObj?.data

      throw apiError
    }
  }

  // Méthodes de convenance pour les différents types de requêtes
  const get = <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    call<T>(endpoint, { ...options, method: HttpMethod.GET })

  const post = <T = unknown>(
    endpoint: string,
    body?: Record<string, unknown> | FormData | string | null,
    options?: ApiRequestOptions,
  ) => call<T>(endpoint, { ...options, method: HttpMethod.POST, body })

  const put = <T = unknown>(
    endpoint: string,
    body?: Record<string, unknown> | FormData | string | null,
    options?: ApiRequestOptions,
  ) => call<T>(endpoint, { ...options, method: HttpMethod.PUT, body })

  const patch = <T = unknown>(
    endpoint: string,
    body?: Record<string, unknown> | FormData | string | null,
    options?: ApiRequestOptions,
  ) => call<T>(endpoint, { ...options, method: HttpMethod.PATCH, body })

  const del = <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    call<T>(endpoint, { ...options, method: HttpMethod.DELETE })

  // Upload de fichiers
  const upload = async (file: File, endpoint: string = API_ENDPOINTS.IMAGE_FILES.UPLOAD) => {
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
