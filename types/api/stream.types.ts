// Domain: stream
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface StreamPaths {
  '/stream/debug/listeners': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for listeners data
     * @description Returns current listeners data for debugging purposes.
     */
    get: operations['StreamController_debugListeners']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/debug/progress': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for progress data
     * @description Returns current progress data for debugging purposes.
     */
    get: operations['StreamController_debugProgress']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/debug/events': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for events data
     * @description Returns current events data for debugging purposes.
     */
    get: operations['StreamController_debugEvents']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/debug/all': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for all stream data
     * @description Returns complete debug information for all streams.
     */
    get: operations['StreamController_debugAll']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/events': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream events via Server-Sent Events
     * @description Real-time stream of combined AirTime and IceCast data including current track info, show details, and streaming metadata.
     */
    get: operations['StreamController_events']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/listeners': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream listeners count via Server-Sent Events
     * @description Real-time stream of current listeners count from IceCast server.
     */
    get: operations['StreamController_listeners']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/progress': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream track progress via Server-Sent Events
     * @description Real-time stream of current track progress percentage from AirTime scheduler.
     */
    get: operations['StreamController_progress']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/metadata': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream enriched metadata via Server-Sent Events
     * @description Real-time stream of enriched metadata (mixtape or track info) that emits only when the track/mixtape changes. Includes full mixtape details from database when available.
     */
    get: operations['StreamController_metadata']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/activity': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream activity data (progress + listeners) via Server-Sent Events
     * @description Real-time stream combining progress percentage and listeners count. Updates every ~3 seconds. No database queries.
     */
    get: operations['StreamController_activity']
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
export type StreamOperations =
  | 'StreamController_debugListeners'
  | 'StreamController_debugProgress'
  | 'StreamController_debugEvents'
  | 'StreamController_debugAll'
  | 'StreamController_events'
  | 'StreamController_listeners'
  | 'StreamController_progress'
  | 'StreamController_metadata'
  | 'StreamController_activity'

// ===== TYPES =====

export type IceCastDataDto = components['schemas']['IceCastDataDto']
export type AirTimeDataDto = components['schemas']['AirTimeDataDto']
export type EventsDataDto = components['schemas']['EventsDataDto']
export type EventsResponseDto = components['schemas']['EventsResponseDto']
export type ListenersResponseDto = components['schemas']['ListenersResponseDto']
export type ProgressResponseDto = components['schemas']['ProgressResponseDto']
export type MetadataStreamDto = components['schemas']['MetadataStreamDto']
export type ActivityStreamDto = components['schemas']['ActivityStreamDto']

// ===== ENDPOINTS =====

export const STREAM_ENDPOINTS = {
  DEBUG_LISTENERS: '/stream/debug/listeners',
  DEBUG_PROGRESS: '/stream/debug/progress',
  DEBUG_EVENTS: '/stream/debug/events',
  DEBUG_ALL: '/stream/debug/all',
  EVENTS: '/stream/events',
  LISTENERS: '/stream/listeners',
  PROGRESS: '/stream/progress',
  METADATA: '/stream/metadata',
  ACTIVITY: '/stream/activity',
} as const
