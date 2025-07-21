// Types helper pour l'API Nina.fm (non générés automatiquement)
// Ces types complètent api-generated.d.ts avec des utilitaires personnalisés

declare global {
  // ===== TYPES UTILITAIRES =====

  /**
   * Type générique pour les fonctions asynchrones
   */
  type AsyncFunc<T extends any[], U> = (...args: T) => Promise<U>

  // ===== TYPES DE RÉPONSE API =====

  /**
   * Réponse API de succès générique
   */
  interface ApiSuccessResponse<T = any> {
    success: true
    data?: T
    message?: string
  }

  /**
   * Réponse API d'erreur générique
   */
  interface ApiErrorResponse {
    success: false
    error: {
      statusCode: number
      message: string
      timestamp: string
    }
  }

  /**
   * Type union des réponses API possibles
   */
  type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

  // ===== INFORMATION DE PAGINATION =====

  /**
   * Informations de pagination (structure réelle de l'API)
   */
  interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }

  /**
   * Réponse paginée générique
   */
  interface PaginatedResponse<T = any> {
    success: true
    data: T[]
    pagination: PaginationInfo
    filters?: Record<string, any>
  }

  // ===== ENUMS PERSONNALISÉS =====

  /**
   * Enum des rôles utilisateur (pour usage dans le frontend)
   */
  enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    CONTRIBUTOR = 'CONTRIBUTOR',
    VIEWER = 'VIEWER',
  }

  // ===== TYPES D'AUTHENTIFICATION =====

  /**
   * Paramètres de connexion
   */
  interface SignInParams {
    email: string
    password: string
  }

  /**
   * Paramètres d'inscription
   */
  interface SignUpParams {
    email: string
    password: string
  }

  /**
   * Tokens d'authentification
   */
  interface AuthTokens {
    accessToken: string
    refreshToken: string
  }

  /**
   * Paramètres de refresh token
   */
  interface RefreshTokenParams {
    refreshToken: string
  }

  /**
   * Réponse des tokens d'authentification
   */
  interface AuthTokensResponse {
    access_token: string
    refresh_token: string
  }

  // ===== TYPES D'UPLOAD DE FICHIERS =====

  /**
   * Réponse d'upload de fichier
   */
  interface FileUploadResponse {
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
  }

  // ===== TYPES DE REQUÊTES (QUERY PARAMS) =====

  /**
   * Paramètres de requête pour les utilisateurs
   */
  interface UserQueryParams {
    page?: number
    limit?: number
    search?: string
    role?: Role
  }

  /**
   * Paramètres de requête pour les DJs
   */
  interface DjQueryParams {
    page?: number
    limit?: number
    search?: string
  }

  /**
   * Paramètres de requête pour les tags
   */
  interface TagQueryParams {
    page?: number
    limit?: number
    search?: string
  }

  /**
   * Paramètres de requête pour les mixtapes
   */
  interface MixtapeQueryParams {
    page?: number
    limit?: number
    search?: string
    year?: number
    djId?: string
    tagId?: string
  }
}

export {}
