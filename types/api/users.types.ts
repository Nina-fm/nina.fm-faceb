// Domain: users
// Auto-generated from API structure analysis

import type { operations } from './globals.types';

export interface UsersPaths {
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all users with pagination and filters
         * @description Retrieve a paginated list of users with optional filtering by role and profile status. Requires authentication and admin privileges.
         */
        get: operations["UsersController_findAll"];
        put?: never;
        /**
         * Create a new user
         * @description Create a new user account. Requires authentication and admin privileges.
         */
        post: operations["UsersController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get user by ID
         * @description Retrieve a specific user by their ID. Users can only access their own profile unless they have admin privileges.
         */
        get: operations["UsersController_findOne"];
        put?: never;
        post?: never;
        /**
         * Delete user
         * @description Delete an existing user. Requires authentication and admin privileges.
         */
        delete: operations["UsersController_remove"];
        options?: never;
        head?: never;
        /**
         * Update user
         * @description Update an existing user. Requires authentication and admin privileges.
         */
        patch: operations["UsersController_update"];
        trace?: never;
    };
    "/users/{id}/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create user profile
         * @description Create a profile for a user. Requires authentication and admin privileges.
         */
        post: operations["UsersController_createProfile"];
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update user profile
         * @description Update a user's profile information. Requires authentication and admin privileges.
         */
        patch: operations["UsersController_updateProfile"];
        trace?: never;
    };
}

// Operations for this domain
export type UsersOperations = "UsersController_findAll" | "UsersController_create" | "UsersController_findOne" | "UsersController_remove" | "UsersController_update" | "UsersController_createProfile" | "UsersController_updateProfile";

// Re-export individual operations  
export type UsersfindAll = operations["UsersController_findAll"];
export type Userscreate = operations["UsersController_create"];
export type UsersfindOne = operations["UsersController_findOne"];
export type Usersremove = operations["UsersController_remove"];
export type Usersupdate = operations["UsersController_update"];
export type UserscreateProfile = operations["UsersController_createProfile"];
export type UsersupdateProfile = operations["UsersController_updateProfile"];
