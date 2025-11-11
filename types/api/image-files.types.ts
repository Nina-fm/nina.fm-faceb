// Domain: image-files
// Auto-generated from API structure analysis

import type { operations } from './globals.types';

export interface ImageFilesPaths {
    "/files/images/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload an image file
         * @description Upload an image file with automatic processing and thumbnail generation.
         */
        post: operations["ImageFilesController_upload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/images/metadata/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get image metadata by ID
         * @description Retrieve metadata for a specific image by its ID.
         */
        get: operations["ImageFilesController_findOne"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/images/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Serve image file by ID
         * @description Serve the original image file by its ID.
         */
        get: operations["ImageFilesController_serveImageById"];
        put?: never;
        post?: never;
        /**
         * Delete image
         * @description Delete an existing image and its files.
         */
        delete: operations["ImageFilesController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/images/{id}/thumbnail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Serve image thumbnail by ID
         * @description Serve the thumbnail version of an image by its ID.
         */
        get: operations["ImageFilesController_serveThumbnailById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/images/images/{bucket}/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Serve image file by URI (compatibility)
         * @description Serve the original image file using bucket/filename URI format.
         */
        get: operations["ImageFilesController_serveByUri"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/images/images/{bucket}/thumb/{filename}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Serve thumbnail by URI (compatibility)
         * @description Serve the thumbnail image file using bucket/thumb/filename URI format.
         */
        get: operations["ImageFilesController_serveThumbnailByUri"];
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
export type ImageFilesOperations = "ImageFilesController_upload" | "ImageFilesController_findOne" | "ImageFilesController_serveImageById" | "ImageFilesController_remove" | "ImageFilesController_serveThumbnailById" | "ImageFilesController_serveByUri" | "ImageFilesController_serveThumbnailByUri";

// Re-export individual operations  
export type ImageFilesupload = operations["ImageFilesController_upload"];
export type ImageFilesfindOne = operations["ImageFilesController_findOne"];
export type ImageFilesserveImageById = operations["ImageFilesController_serveImageById"];
export type ImageFilesremove = operations["ImageFilesController_remove"];
export type ImageFilesserveThumbnailById = operations["ImageFilesController_serveThumbnailById"];
export type ImageFilesserveByUri = operations["ImageFilesController_serveByUri"];
export type ImageFilesserveThumbnailByUri = operations["ImageFilesController_serveThumbnailByUri"];
