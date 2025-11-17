// Domain: image-files
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface ImageFilesPaths {
  '/files/images/upload': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Upload an image file
     * @description Upload an image file with automatic processing and thumbnail generation.
     */
    post: operations['ImageFilesController_upload']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get images by bucket
     * @description Retrieve all images from a specific bucket. The bucket parameter is required.
     */
    get: operations['ImageFilesController_findByBucket']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/metadata/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get image metadata by ID
     * @description Retrieve metadata for a specific image by its ID.
     */
    get: operations['ImageFilesController_findOne']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve image file by ID
     * @description Serve the original image file by its ID.
     */
    get: operations['ImageFilesController_serveImageById']
    put?: never
    post?: never
    /**
     * Delete image
     * @description Delete an existing image and its files.
     */
    delete: operations['ImageFilesController_remove']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/{id}/thumbnail': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve image thumbnail by ID
     * @description Serve the thumbnail version of an image by its ID.
     */
    get: operations['ImageFilesController_serveThumbnailById']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/images/{bucket}/{filename}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve image file by URI (compatibility)
     * @description Serve the original image file using bucket/filename URI format.
     */
    get: operations['ImageFilesController_serveByUri']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/images/{bucket}/thumb/{filename}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve thumbnail by URI (compatibility)
     * @description Serve the thumbnail image file using bucket/thumb/filename URI format.
     */
    get: operations['ImageFilesController_serveThumbnailByUri']
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
export type ImageFilesOperations =
  | 'ImageFilesController_upload'
  | 'ImageFilesController_findByBucket'
  | 'ImageFilesController_findOne'
  | 'ImageFilesController_serveImageById'
  | 'ImageFilesController_remove'
  | 'ImageFilesController_serveThumbnailById'
  | 'ImageFilesController_serveByUri'
  | 'ImageFilesController_serveThumbnailByUri'

// ===== TYPES =====

export type ImageFile = components['schemas']['ImageFile']

// ===== ENDPOINTS =====

export const IMAGE_FILES_ENDPOINTS = {
  UPLOAD: '/files/images/upload',
  BASE: '/files/images',
  METADATA: (id: string) => `/files/images/metadata/${id}`,
  BY_ID: (id: string) => `/files/images/${id}`,
  THUMBNAIL: (id: string) => `/files/images/${id}/thumbnail`,
  PUBLIC: (bucket: string, filename: string) => `/files/images/images/${bucket}/${filename}`,
  THUMB: (bucket: string, filename: string) => `/files/images/images/${bucket}/thumb/${filename}`,
} as const
