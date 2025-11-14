// Domain: sessions
// Auto-generated from API structure analysis

import type { operations } from './globals.types'

export interface SessionsPaths {
  '/sessions/{sessionId}/tracks': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all tracks for a session
     * @description Retrieve all audio tracks for a given mix session.
     */
    get: operations['TracksController_findAll']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sessions/{sessionId}/tracks/upload': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Upload a track to a session
     * @description Upload an audio file to add to the mix session timeline.
     */
    post: operations['TracksController_upload']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sessions/{sessionId}/tracks/reorder': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    /**
     * Reorder tracks in timeline
     * @description Update the order of tracks in the mix session timeline.
     */
    patch: operations['TracksController_reorder']
    trace?: never
  }
  '/sessions/{sessionId}/tracks/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get track details
     * @description Retrieve track metadata and information.
     */
    get: operations['TracksController_findOne']
    put?: never
    post?: never
    /**
     * Delete track
     * @description Delete a track from the session and remove the audio file.
     */
    delete: operations['TracksController_remove']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sessions/{sessionId}/tracks/{id}/stream': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream track audio
     * @description Stream the audio file content for playback.
     */
    get: operations['TracksController_stream']
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
export type SessionsOperations =
  | 'TracksController_findAll'
  | 'TracksController_upload'
  | 'TracksController_reorder'
  | 'TracksController_findOne'
  | 'TracksController_remove'
  | 'TracksController_stream'

// ===== ENDPOINTS =====

export const SESSIONS_ENDPOINTS = {
  TRACKS: (sessionId: string) => `/sessions/${sessionId}/tracks`,
  TRACKS_UPLOAD: (sessionId: string) => `/sessions/${sessionId}/tracks/upload`,
  TRACKS_REORDER: (sessionId: string) => `/sessions/${sessionId}/tracks/reorder`,
  TRACKS_WITH_ID: (sessionId: string, id: string) => `/sessions/${sessionId}/tracks/${id}`,
  TRACKS__STREAM: (sessionId: string, id: string) => `/sessions/${sessionId}/tracks/${id}/stream`,
} as const
