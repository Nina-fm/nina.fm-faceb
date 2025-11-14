// Domain: mixtapes
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface MixtapesPaths {
  '/mixtapes': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all mixtapes with pagination and filters
     * @description Retrieve a paginated list of mixtapes with optional filtering by tags, DJ, year range, and search. Supports sorting and pagination.
     */
    get: operations['MixtapesController_findAll']
    put?: never
    /**
     * Create a new mixtape
     * @description Create a new mixtape with optional tags that will be auto-created if they don't exist. Requires authentication.
     */
    post: operations['MixtapesController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get mixtape by ID
     * @description Retrieve a specific mixtape by its ID with cover information. Requires authentication.
     */
    get: operations['MixtapesController_findOne']
    put?: never
    post?: never
    /**
     * Delete mixtape
     * @description Delete an existing mixtape and its associated cover image. Requires authentication.
     */
    delete: operations['MixtapesController_remove']
    options?: never
    head?: never
    /**
     * Update mixtape
     * @description Update an existing mixtape. Requires authentication.
     */
    patch: operations['MixtapesController_update']
    trace?: never
  }
  '/mixtapes/{id}/cover/{imageId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    /**
     * Set mixtape cover
     * @description Associate an image as the cover for a mixtape. Requires authentication.
     */
    put: operations['MixtapesController_updateCover']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/cover': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /**
     * Remove mixtape cover
     * @description Remove the cover from a mixtape and delete the associated image file.
     */
    delete: operations['MixtapesController_removeCover']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/tags': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get mixtape tags
     * @description Retrieve all tags associated with a specific mixtape.
     */
    get: operations['MixtapesController_getMixtapeTags']
    put?: never
    /**
     * Add tags to mixtape
     * @description Add multiple tags to a mixtape. Tags will be created automatically if they do not exist.
     */
    post: operations['MixtapesController_addTagsToMixtape']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/tags/{tagId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /**
     * Remove tag from mixtape
     * @description Remove a specific tag from a mixtape.
     */
    delete: operations['MixtapesController_removeTagFromMixtape']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/djs': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get mixtape DJs
     * @description Retrieve all DJs associated with a specific mixtape.
     */
    get: operations['MixtapesController_getMixtapeDjs']
    put?: never
    /**
     * Add DJs to mixtape
     * @description Add multiple DJs to a mixtape. DJs will be created automatically if they do not exist.
     */
    post: operations['MixtapesController_addDjsToMixtape']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/djs/{djId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /**
     * Remove DJ from mixtape
     * @description Remove a specific DJ from a mixtape.
     */
    delete: operations['MixtapesController_removeDjFromMixtape']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}

// Operations for this domain
export type MixtapesOperations =
  | 'MixtapesController_findAll'
  | 'MixtapesController_create'
  | 'MixtapesController_findOne'
  | 'MixtapesController_remove'
  | 'MixtapesController_update'
  | 'MixtapesController_updateCover'
  | 'MixtapesController_removeCover'
  | 'MixtapesController_getMixtapeTags'
  | 'MixtapesController_addTagsToMixtape'
  | 'MixtapesController_removeTagFromMixtape'
  | 'MixtapesController_getMixtapeDjs'
  | 'MixtapesController_addDjsToMixtape'
  | 'MixtapesController_removeDjFromMixtape'

// ===== TYPES =====

export type Mixtape = components['schemas']['Mixtape']
export type DjWithMixtapesCount = components['schemas']['DjWithMixtapesCount']
export type MixtapesQueryDto = components['schemas']['MixtapesQueryDto']
export type MixtapesListResponseDto = components['schemas']['MixtapesListResponseDto']
export type MixtapeResponseDto = components['schemas']['MixtapeResponseDto']
export type CreateMixtapeDto = components['schemas']['CreateMixtapeDto']
export type UpdateMixtapeDto = components['schemas']['UpdateMixtapeDto']
export type AddTagsToMixtapeDto = components['schemas']['AddTagsToMixtapeDto']
export type AddDjsToMixtapeDto = components['schemas']['AddDjsToMixtapeDto']

// ===== ENDPOINTS =====

export const MIXTAPES_ENDPOINTS = {
  BASE: '/mixtapes',
  BY_ID: (id: string) => `/mixtapes/${id}`,
  COVER: (id: string, imageId: string) => `/mixtapes/${id}/cover/${imageId}`,
  COVER_DETAIL: (id: string) => `/mixtapes/${id}/cover`,
  TAGS: (id: string) => `/mixtapes/${id}/tags`,
  TAGS_WITH_TAGID: (id: string, tagId: string) => `/mixtapes/${id}/tags/${tagId}`,
  DJS: (id: string) => `/mixtapes/${id}/djs`,
  DJS_WITH_DJID: (id: string, djId: string) => `/mixtapes/${id}/djs/${djId}`,
} as const
