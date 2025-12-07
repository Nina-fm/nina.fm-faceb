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
    /** User login - Simple wrapper around SuperTokens */
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
    /** User registration - Simple wrapper around SuperTokens */
    post: operations['AuthController_signUp']
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
    /** User logout - Simple wrapper around SuperTokens */
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
  '/auth/session': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get SuperTokens session info */
    get: operations['AuthController_getSession']
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
  '/auth/check-email': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Check if an email already exists in the system */
    get: operations['AuthController_checkEmail']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/link-invitation': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Link an existing account with an invitation
     * @description Verifies credentials, applies role from invitation, and grants app access
     */
    post: operations['AuthController_linkInvitation']
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
  | 'AuthController_signOut'
  | 'AuthController_getProfile'
  | 'AuthController_getSession'
  | 'AuthController_forgotPassword'
  | 'AuthController_resetPassword'
  | 'AuthController_checkEmail'
  | 'AuthController_linkInvitation'

// ===== TYPES =====

export type SignInDto = components['schemas']['SignInDto']
export type SignUpDto = components['schemas']['SignUpDto']
export type ForgotPasswordDto = components['schemas']['ForgotPasswordDto']
export type ResetPasswordDto = components['schemas']['ResetPasswordDto']

// ===== ENDPOINTS =====

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  SESSION: '/auth/session',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHECK_EMAIL: '/auth/check-email',
  LINK_INVITATION: '/auth/link-invitation',
} as const
