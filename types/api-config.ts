// API Configuration - Manual front-end configuration
// This file contains manual configuration for the front-end application.
// Edit this file as needed for your application settings.

// ============================================================================
// AUTO-GENERATED RE-EXPORTS
// ============================================================================

// Re-export API_ENDPOINTS from the auto-generated file
export { API_ENDPOINTS } from './api/endpoints'
export type { ApiEndpoints } from './api/endpoints'

// Re-export base types from the API (auto-generated)
export type { BaseQueryDto, BaseResponseDto, PaginatedResponse } from './api/base.types'

// ============================================================================
// MANUAL FRONT-END CONFIGURATION
// ============================================================================

/**
 * Front-end API configuration
 */
export const API_CONFIG = {
  DEFAULT_PAGINATION: {
    page: 1,
    limit: 20,
  },

  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  TOKEN_STORAGE_KEY: 'nina-auth-tokens',
  USER_STORAGE_KEY: 'nina-current-user',

  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

export type ApiConfig = typeof API_CONFIG
export type HttpStatus = typeof HTTP_STATUS

// ============================================================================
// FRONT-END HELPER TYPES
// ============================================================================
// These types don't exist in the API - they're front-end wrappers

/**
 * API success response wrapper
 * Used for wrapping successful API responses
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
}

/**
 * API error response wrapper
 * Used for wrapping API error responses
 */
export interface ApiErrorResponse {
  success: false
  error: {
    statusCode: number
    message: string
    timestamp: string
  }
}

/**
 * Union type of all possible API responses
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
