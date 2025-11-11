// Domain: djs
// Auto-generated from API structure analysis

import type { operations } from './globals.types';

export interface DjsPaths {
    "/djs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all DJs with pagination and filters
         * @description Retrieve all DJs with optional filtering by mixtape presence and search capabilities.
         */
        get: operations["DjsController_findAll"];
        put?: never;
        /**
         * Create a new DJ
         * @description Create a new DJ with automatic slug generation.
         */
        post: operations["DjsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/djs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get DJ by ID
         * @description Retrieve a specific DJ by their unique identifier.
         */
        get: operations["DjsController_findOne"];
        put?: never;
        post?: never;
        /**
         * Delete DJ
         * @description Delete a DJ by ID.
         */
        delete: operations["DjsController_remove"];
        options?: never;
        head?: never;
        /**
         * Update DJ
         * @description Update an existing DJ by ID.
         */
        patch: operations["DjsController_update"];
        trace?: never;
    };
    "/djs/{id}/mixtapes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get DJ mixtapes
         * @description Retrieve all mixtapes associated with a specific DJ.
         */
        get: operations["DjsController_getDjMixtapes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}

// Operations for this domain
export type DjsOperations = "DjsController_findAll" | "DjsController_create" | "DjsController_findOne" | "DjsController_remove" | "DjsController_update" | "DjsController_getDjMixtapes";

// Re-export individual operations  
export type DjsfindAll = operations["DjsController_findAll"];
export type Djscreate = operations["DjsController_create"];
export type DjsfindOne = operations["DjsController_findOne"];
export type Djsremove = operations["DjsController_remove"];
export type Djsupdate = operations["DjsController_update"];
export type DjsgetDjMixtapes = operations["DjsController_getDjMixtapes"];
