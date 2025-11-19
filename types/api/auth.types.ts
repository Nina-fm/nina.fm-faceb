// Domain: auth
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface AuthPaths {
  '/auth/login': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** User login */
    post: operations['AuthController_signIn']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/register': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** User registration */
    post: operations['AuthController_signUp']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/refresh': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Refresh access token */
    post: operations['AuthController_refreshTokens']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/logout': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** User logout */
    post: operations['AuthController_signOut']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/profile': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get current user profile */
    get: operations['AuthController_getProfile']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/forgot-password': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Request password reset */
    post: operations['AuthController_forgotPassword']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/reset-password': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Reset password with token */
    post: operations['AuthController_resetPassword']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}

// Operations for this domain
export type AuthOperations =
  | 'AuthController_signIn'
  | 'AuthController_signUp'
  | 'AuthController_refreshTokens'
  | 'AuthController_signOut'
  | 'AuthController_getProfile'
  | 'AuthController_forgotPassword'
  | 'AuthController_resetPassword'

// ===== TYPES =====

export type SignInDto = components['schemas']['SignInDto']
export type SignUpDto = components['schemas']['SignUpDto']
export type ForgotPasswordDto = components['schemas']['ForgotPasswordDto']
export type ResetPasswordDto = components['schemas']['ResetPasswordDto']

// ===== ENDPOINTS =====

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const
