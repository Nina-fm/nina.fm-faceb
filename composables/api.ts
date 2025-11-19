import type { FetchOptions } from 'ofetch'
import type { components } from '~/types/api'
import { API_CONFIG, API_ENDPOINTS } from '~/types/api-config'

type ImageFile = components['schemas']['ImageFile']

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

  // IMPORTANT: useTokenRefresh ne doit être appelé que côté client
  // car il utilise navigateTo et autres composables client-only
  const { refreshToken } = import.meta.client ? useTokenRefresh() : { refreshToken: async () => false }

  const baseURL = (config.public.apiUrl as string) || 'http://localhost:4000'

  // Flag pour éviter les boucles infinies de retry
  let isRefreshing = false

  /**
   * Fonction générique pour effectuer des appels API
   */
  const call = async <T = unknown>(endpoint: string, options: ApiRequestOptions = {}, isRetry = false): Promise<T> => {
    const {
      method = HttpMethod.GET,
      requireAuth: _requireAuth = true, // Conservé pour compatibilité API, mais non utilisé (cookies auto)
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

    // Note: Pas besoin d'ajouter Authorization header manuellement
    // Les cookies httpOnly sont automatiquement envoyés avec credentials: 'include'

    try {
      const fetchConfig: Record<string, unknown> = {
        ...fetchOptions,
        method,
        baseURL,
        headers: requestHeaders,
        timeout,
        credentials: 'include', // Important: envoyer les cookies avec chaque requête
        onRequest() {
          // Log des requêtes en développement
          if (import.meta.dev) {
            console.log(`[API] ${method} ${endpoint}${isRetry ? ' (retry)' : ''}`)
          }
        },
        onRequestError(context: { error: unknown }) {
          console.error('[API] Request Error:', context.error)
        },
      }

      // Utilisation de l'assertion de type pour contourner les conflits de types complexes de Nuxt
      const response = await ($fetch as (url: string, opts?: Record<string, unknown>) => Promise<T>)(
        endpoint,
        fetchConfig,
      )
      return response
    } catch (error: unknown) {
      const errorObj = error as Record<string, unknown>
      const status = (errorObj?.status || errorObj?.statusCode) as number

      // Gestion du 401 : tentative de refresh puis retry
      if (status === 401 && !endpoint.includes('/auth/') && !isRetry) {
        // Éviter les boucles infinies
        if (isRefreshing) {
          console.log('[API] Refresh déjà en cours - redirection vers /login')
          await navigateTo('/login')
          throw error
        }

        console.log('[API] 401 Unauthorized - tentative de refresh du token')
        isRefreshing = true

        try {
          const refreshSuccess = await refreshToken()
          isRefreshing = false

          if (refreshSuccess) {
            console.log('[API] Token refreshed - retry de la requête...')
            // Retry la requête originale avec le nouveau token
            return await call<T>(endpoint, options, true)
          } else {
            console.log('[API] Refresh échoué - redirection vers /login')
            await navigateTo('/login')
            throw error
          }
        } catch (refreshError) {
          isRefreshing = false
          console.error('[API] Erreur lors du refresh:', refreshError)
          await navigateTo('/login')
          throw error
        }
      }

      // Transformation de l'erreur pour l'interface utilisateur
      const apiError: ApiError = new Error(
        ((errorObj?.data as Record<string, unknown>)?.message as string) ||
          (errorObj?.message as string) ||
          'Une erreur est survenue',
      )
      apiError.statusCode = status
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

    return await call<ImageFile>(endpoint, {
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
