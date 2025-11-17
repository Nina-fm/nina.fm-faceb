// Domain: tags
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface TagsPaths {
  '/tags': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all tags with pagination and filters
     * @description Retrieve all tags with optional filtering by usage in mixtapes and search capabilities.
     */
    get: operations['TagsController_findAll']
    put?: never
    /**
     * Create a new tag
     * @description Create a new tag with automatic slug generation.
     */
    post: operations['TagsController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/tags/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get tag by ID
     * @description Retrieve a specific tag by its unique identifier.
     */
    get: operations['TagsController_findOne']
    put?: never
    post?: never
    /**
     * Delete tag
     * @description Delete a tag by ID.
     */
    delete: operations['TagsController_remove']
    options?: never
    head?: never
    /**
     * Update tag
     * @description Update an existing tag by ID.
     */
    patch: operations['TagsController_update']
    trace?: never
  }
  '/tags/{id}/mixtapes': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get tag mixtapes
     * @description Retrieve all mixtapes associated with a specific tag.
     */
    get: operations['TagsController_getTagMixtapes']
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
export type TagsOperations =
  | 'TagsController_findAll'
  | 'TagsController_create'
  | 'TagsController_findOne'
  | 'TagsController_remove'
  | 'TagsController_update'
  | 'TagsController_getTagMixtapes'

// ===== TYPES =====

export type Tag = components['schemas']['Tag']
export type TagsQueryDto = components['schemas']['TagsQueryDto']
export type TagsListResponseDto = components['schemas']['TagsListResponseDto']
export type TagResponseDto = components['schemas']['TagResponseDto']

// ===== ENDPOINTS =====

export const TAGS_ENDPOINTS = {
  BASE: '/tags',
  BY_ID: (id: string) => `/tags/${id}`,
  MIXTAPES: (id: string) => `/tags/${id}/mixtapes`,
} as const
