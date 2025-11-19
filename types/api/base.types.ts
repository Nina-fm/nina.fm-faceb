// Domain: base
// Auto-generated from API structure analysis

import type { components } from './globals.types'

// ===== TYPES =====

export type BaseQueryDto = components['schemas']['BaseQueryDto']
export type BaseResponseDto = components['schemas']['BaseResponseDto']

// ===== GENERIC HELPERS =====

/**
 * Generic paginated response type based on BaseResponseDto
 * This extends the base response with typed data array
 * Use this instead of specific response types when you need a generic paginated list
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters?: Record<string, unknown>
}
