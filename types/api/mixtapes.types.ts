// Domain: mixtapes
// Auto-generated from API structure analysis

import type { operations } from './globals.types';

export interface MixtapesPaths {
    "/mixtapes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all mixtapes with pagination and filters
         * @description Retrieve a paginated list of mixtapes with optional filtering by tags, DJ, year range, and search. Supports sorting and pagination.
         */
        get: operations["MixtapesController_findAll"];
        put?: never;
        /**
         * Create a new mixtape
         * @description Create a new mixtape with optional tags that will be auto-created if they don't exist. Requires authentication.
         */
        post: operations["MixtapesController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mixtapes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get mixtape by ID
         * @description Retrieve a specific mixtape by its ID with cover information. Requires authentication.
         */
        get: operations["MixtapesController_findOne"];
        put?: never;
        post?: never;
        /**
         * Delete mixtape
         * @description Delete an existing mixtape and its associated cover image. Requires authentication.
         */
        delete: operations["MixtapesController_remove"];
        options?: never;
        head?: never;
        /**
         * Update mixtape
         * @description Update an existing mixtape. Requires authentication.
         */
        patch: operations["MixtapesController_update"];
        trace?: never;
    };
    "/mixtapes/{id}/cover/{imageId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Set mixtape cover
         * @description Associate an image as the cover for a mixtape. Requires authentication.
         */
        put: operations["MixtapesController_updateCover"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mixtapes/{id}/cover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove mixtape cover
         * @description Remove the cover from a mixtape and delete the associated image file.
         */
        delete: operations["MixtapesController_removeCover"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mixtapes/{id}/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get mixtape tags
         * @description Retrieve all tags associated with a specific mixtape.
         */
        get: operations["MixtapesController_getMixtapeTags"];
        put?: never;
        /**
         * Add tags to mixtape
         * @description Add multiple tags to a mixtape. Tags will be created automatically if they do not exist.
         */
        post: operations["MixtapesController_addTagsToMixtape"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mixtapes/{id}/tags/{tagId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove tag from mixtape
         * @description Remove a specific tag from a mixtape.
         */
        delete: operations["MixtapesController_removeTagFromMixtape"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mixtapes/{id}/djs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get mixtape DJs
         * @description Retrieve all DJs associated with a specific mixtape.
         */
        get: operations["MixtapesController_getMixtapeDjs"];
        put?: never;
        /**
         * Add DJs to mixtape
         * @description Add multiple DJs to a mixtape. DJs will be created automatically if they do not exist.
         */
        post: operations["MixtapesController_addDjsToMixtape"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mixtapes/{id}/djs/{djId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove DJ from mixtape
         * @description Remove a specific DJ from a mixtape.
         */
        delete: operations["MixtapesController_removeDjFromMixtape"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}

// Operations for this domain
export type MixtapesOperations = "MixtapesController_findAll" | "MixtapesController_create" | "MixtapesController_findOne" | "MixtapesController_remove" | "MixtapesController_update" | "MixtapesController_updateCover" | "MixtapesController_removeCover" | "MixtapesController_getMixtapeTags" | "MixtapesController_addTagsToMixtape" | "MixtapesController_removeTagFromMixtape" | "MixtapesController_getMixtapeDjs" | "MixtapesController_addDjsToMixtape" | "MixtapesController_removeDjFromMixtape";

// Re-export individual operations  
export type MixtapesfindAll = operations["MixtapesController_findAll"];
export type Mixtapescreate = operations["MixtapesController_create"];
export type MixtapesfindOne = operations["MixtapesController_findOne"];
export type Mixtapesremove = operations["MixtapesController_remove"];
export type Mixtapesupdate = operations["MixtapesController_update"];
export type MixtapesupdateCover = operations["MixtapesController_updateCover"];
export type MixtapesremoveCover = operations["MixtapesController_removeCover"];
export type MixtapesgetMixtapeTags = operations["MixtapesController_getMixtapeTags"];
export type MixtapesaddTagsToMixtape = operations["MixtapesController_addTagsToMixtape"];
export type MixtapesremoveTagFromMixtape = operations["MixtapesController_removeTagFromMixtape"];
export type MixtapesgetMixtapeDjs = operations["MixtapesController_getMixtapeDjs"];
export type MixtapesaddDjsToMixtape = operations["MixtapesController_addDjsToMixtape"];
export type MixtapesremoveDjFromMixtape = operations["MixtapesController_removeDjFromMixtape"];
