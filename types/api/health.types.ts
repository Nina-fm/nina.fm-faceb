// Domain: health
// Auto-generated from API structure analysis

import type { operations } from './globals.types';

export interface HealthPaths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health check endpoint */
        get: operations["HealthController_healthCheck"];
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
export type HealthOperations = "HealthController_healthCheck";

// Re-export individual operations  
export type HealthhealthCheck = operations["HealthController_healthCheck"];
