// API Configuration and Constants

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGN_UP: '/auth/signup',
    SIGN_IN: '/auth/signin',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
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
    AVATAR: (id: string) => `/djs/${id}/avatar`,
  },

  // Tags
  TAGS: {
    BASE: '/tags',
    BY_ID: (id: string) => `/tags/${id}`,
  },

  // Mixtapes
  MIXTAPES: {
    BASE: '/mixtapes',
    BY_ID: (id: string) => `/mixtapes/${id}`,
    COVER: (id: string) => `/mixtapes/${id}/cover`,
  },

  // Images
  IMAGES: {
    UPLOAD: '/images/upload',
    BY_ID: (id: string) => `/images/${id}`,
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
