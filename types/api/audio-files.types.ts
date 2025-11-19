// Domain: audio-files
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface AudioFilesPaths {
  '/files/audio': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all audio files
     * @description Retrieve a list of all uploaded audio files.
     */
    get: operations['AudioFilesController_findAll']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/upload': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Upload an audio file
     * @description Upload an audio file with automatic processing and metadata extraction.
     */
    post: operations['AudioFilesController_upload']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get audio file details
     * @description Retrieve audio file metadata and information.
     */
    get: operations['AudioFilesController_findOne']
    put?: never
    post?: never
    /**
     * Delete audio file
     * @description Delete an audio file and its associated metadata permanently.
     */
    delete: operations['AudioFilesController_remove']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/{id}/stream': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream audio file
     * @description Stream the audio file content optimized for playback.
     */
    get: operations['AudioFilesController_stream']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/{path}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve audio file by full URI path
     * @description Serve audio file using the complete URI path stored in database.
     */
    get: operations['AudioFilesController_serveByFullUri']
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
export type AudioFilesOperations =
  | 'AudioFilesController_findAll'
  | 'AudioFilesController_upload'
  | 'AudioFilesController_findOne'
  | 'AudioFilesController_remove'
  | 'AudioFilesController_stream'
  | 'AudioFilesController_serveByFullUri'

// ===== TYPES =====

export type AudioFile = components['schemas']['AudioFile']

// ===== ENDPOINTS =====

export const AUDIO_FILES_ENDPOINTS = {
  BASE: '/files/audio',
  UPLOAD: '/files/audio/upload',
  BY_ID: (id: string) => `/files/audio/${id}`,
  BASE_DETAIL: (id: string) => `/files/audio/${id}/stream`,
  BY_ID_DETAIL: (path: string) => `/files/audio/${path}`,
} as const
