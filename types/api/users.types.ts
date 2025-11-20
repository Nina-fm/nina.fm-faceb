// Domain: users
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface UsersPaths {
  '/users': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all users with pagination and filters
     * @description Retrieve a paginated list of users with optional filtering by role and profile status. Requires authentication and admin privileges.
     */
    get: operations['UsersController_findAll']
    put?: never
    /**
     * Create a new user
     * @description Create a new user account. Requires authentication and admin privileges.
     */
    post: operations['UsersController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/users/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get user by ID
     * @description Retrieve a specific user by their ID. Users with READ_ALL_USERS permission (ADMIN, MANAGER) can access any user. Others can only access their own profile.
     */
    get: operations['UsersController_findOne']
    put?: never
    post?: never
    /**
     * Delete user
     * @description Delete an existing user. Requires authentication and admin privileges.
     */
    delete: operations['UsersController_remove']
    options?: never
    head?: never
    /**
     * Update user
     * @description Update an existing user. Requires authentication and admin privileges.
     */
    patch: operations['UsersController_update']
    trace?: never
  }
  '/users/{id}/profile': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Create user profile
     * @description Create a profile for a user. Requires authentication and admin privileges.
     */
    post: operations['UsersController_createProfile']
    delete?: never
    options?: never
    head?: never
    /**
     * Update user profile
     * @description Update a user's profile information. All users can update their own profile.
     */
    patch: operations['UsersController_updateProfile']
    trace?: never
  }
}

// Operations for this domain
export type UsersOperations =
  | 'UsersController_findAll'
  | 'UsersController_create'
  | 'UsersController_findOne'
  | 'UsersController_remove'
  | 'UsersController_update'
  | 'UsersController_createProfile'
  | 'UsersController_updateProfile'

// ===== TYPES =====

export type User = components['schemas']['User']
export type Profile = components['schemas']['Profile']
export type UsersQueryDto = components['schemas']['UsersQueryDto']
export type UsersListResponseDto = components['schemas']['UsersListResponseDto']
export type UserResponseDto = components['schemas']['UserResponseDto']
export type CreateUserDto = components['schemas']['CreateUserDto']
export type UpdateUserDto = components['schemas']['UpdateUserDto']
export type UpdateUserProfileDto = components['schemas']['UpdateUserProfileDto']
export type UserWithProfileDto = components['schemas']['UserWithProfileDto']

// ===== HELPER TYPES =====

/**
 * User role type extracted from User schema
 */
export type Role = User['role']

/**
 * User role constants for runtime usage
 * Auto-generated from API, stays in sync with Role type
 */
export const UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  VIEWER: 'VIEWER',
  PUBLIC: 'PUBLIC',
} as const satisfies Record<string, Role>

/**
 * Array of all user roles for iteration/validation
 */
export const USER_ROLES = Object.values(UserRole)
// ===== ENDPOINTS =====

export const USERS_ENDPOINTS = {
  BASE: '/users',
  BY_ID: (id: string) => `/users/${id}`,
  PROFILE: (id: string) => `/users/${id}/profile`,
} as const
