// API Configuration and Constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGN_UP: '/auth/register',
    SIGN_IN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: (id: string) => `/users/${id}/profile`,
  },

  // DJs
  DJS: {
    BASE: '/djs',
    BY_ID: (id: string) => `/djs/${id}`,
    MIXTAPES: (id: string) => `/djs/${id}/mixtapes`,
  },

  // Tags
  TAGS: {
    BASE: '/tags',
    BY_ID: (id: string) => `/tags/${id}`,
    MIXTAPES: (id: string) => `/tags/${id}/mixtapes`,
  },

  // Invitations
  INVITATIONS: {
    BASE: '/invitations',
    SEND: '/invitations/send',
    VALIDATE: '/invitations/validate',
    BY_ID: (id: string) => `/invitations/${id}`,
  },

  // Mixtapes
  MIXTAPES: {
    BASE: '/mixtapes',
    BY_ID: (id: string) => `/mixtapes/${id}`,
    COVER: (id: string) => `/mixtapes/${id}/cover`,
    COVER_WITH_IMAGE: (id: string, imageId: string) => `/mixtapes/${id}/cover/${imageId}`,
    TAGS: (id: string) => `/mixtapes/${id}/tags`,
    TAG: (id: string, tagId: string) => `/mixtapes/${id}/tags/${tagId}`,
    DJS: (id: string) => `/mixtapes/${id}/djs`,
    DJ: (id: string, djId: string) => `/mixtapes/${id}/djs/${djId}`,
  },

  // Images
  IMAGES: {
    BASE: '/files/images',
    UPLOAD: '/files/images/upload',
    BY_ID: (id: string) => `/files/images/${id}`,
    METADATA: (id: string) => `/files/images/metadata/${id}`,
    THUMBNAIL: (id: string) => `/files/images/${id}/thumbnail`,
    PUBLIC: (bucket: string, filename: string) => `/files/images/images/${bucket}/${filename}`,
    THUMB: (bucket: string, filename: string) => `/files/images/images/${bucket}/thumb/${filename}`,
  },

  // Stream
  STREAM: {
    EVENTS: '/stream/events',
    LISTENERS: '/stream/listeners',
    PROGRESS: '/stream/progress',
    DEBUG: {
      ALL: '/stream/debug/all',
      EVENTS: '/stream/debug/events',
      LISTENERS: '/stream/debug/listeners',
      PROGRESS: '/stream/debug/progress',
    },
  },

  // Health
  HEALTH: {
    CHECK: '/health',
  },
} as const

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

export type ApiEndpoint = typeof API_ENDPOINTS
export type ApiConfig = typeof API_CONFIG
export type HttpStatus = typeof HTTP_STATUS
