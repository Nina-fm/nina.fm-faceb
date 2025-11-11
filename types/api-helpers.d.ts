// Types utilitaires pour l'API Nina.fm (non générés automatiquement)
// Types complémentaires aux types auto-générés dans /types/api/

declare global {
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
  interface PaginatedResponse<T = unknown> {
    data: T[]
    pagination: PaginationInfo
    filters?: Record<string, unknown>
  }

  // ===== TYPES DE RÉPONSE API =====

  /**
   * Réponse API de succès générique
   */
  interface ApiSuccessResponse<T = unknown> {
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
  type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
}

export {}
