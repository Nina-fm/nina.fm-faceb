// Domain: djs
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface DjsPaths {
  '/djs': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all DJs with pagination and filters
     * @description Retrieve all DJs with optional filtering by mixtape presence and search capabilities.
     */
    get: operations['DjsController_findAll']
    put?: never
    /**
     * Create a new DJ
     * @description Create a new DJ with automatic slug generation.
     */
    post: operations['DjsController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/djs/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get DJ by ID
     * @description Retrieve a specific DJ by their unique identifier.
     */
    get: operations['DjsController_findOne']
    put?: never
    post?: never
    /**
     * Delete DJ
     * @description Delete a DJ by ID.
     */
    delete: operations['DjsController_remove']
    options?: never
    head?: never
    /**
     * Update DJ
     * @description Update an existing DJ by ID.
     */
    patch: operations['DjsController_update']
    trace?: never
  }
  '/djs/{id}/mixtapes': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get DJ mixtapes
     * @description Retrieve all mixtapes associated with a specific DJ.
     */
    get: operations['DjsController_getDjMixtapes']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}

// Operations for this domain
export type DjsOperations =
  | 'DjsController_findAll'
  | 'DjsController_create'
  | 'DjsController_findOne'
  | 'DjsController_remove'
  | 'DjsController_update'
  | 'DjsController_getDjMixtapes'

// ===== TYPES =====

export type Dj = components['schemas']['Dj']
export type DjsQueryDto = components['schemas']['DjsQueryDto']
export type DjsListResponseDto = components['schemas']['DjsListResponseDto']
export type DjResponseDto = components['schemas']['DjResponseDto']

// ===== ENDPOINTS =====

export const DJS_ENDPOINTS = {
  BASE: '/djs',
  BY_ID: (id: string) => `/djs/${id}`,
  MIXTAPES: (id: string) => `/djs/${id}/mixtapes`,
} as const
