// Domain: mix-sessions
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types';

export interface MixSessionsPaths {
    "/mix-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lister toutes les sessions de l'utilisateur */
        get: operations["MixSessionsController_findAll"];
        put?: never;
        /** Créer une nouvelle session de mix */
        post: operations["MixSessionsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mix-sessions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Récupérer une session spécifique */
        get: operations["MixSessionsController_findOne"];
        put?: never;
        post?: never;
        /** Supprimer une session */
        delete: operations["MixSessionsController_remove"];
        options?: never;
        head?: never;
        /** Mettre à jour une session */
        patch: operations["MixSessionsController_update"];
        trace?: never;
    };
    "/mix-sessions/{id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Exporter une session en fichier MP3 */
        post: operations["MixSessionsController_export"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/mix-sessions/{id}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Télécharger le fichier MP3 exporté */
        get: operations["MixSessionsController_download"];
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
export type MixSessionsOperations = "MixSessionsController_findAll" | "MixSessionsController_create" | "MixSessionsController_findOne" | "MixSessionsController_remove" | "MixSessionsController_update" | "MixSessionsController_export" | "MixSessionsController_download";

// ===== TYPES =====

export type SessionTrack = components['schemas']['SessionTrack'];
export type MixSession = components['schemas']['MixSession'];
export type CreateMixSessionDto = components['schemas']['CreateMixSessionDto'];
export type UpdateMixSessionDto = components['schemas']['UpdateMixSessionDto'];

// ===== ENDPOINTS =====

export const MIX_SESSIONS_ENDPOINTS = {
  BASE: '/mix-sessions',
  BY_ID: (id: string) => `/mix-sessions/${id}`,
  EXPORT: (id: string) => `/mix-sessions/${id}/export`,
  DOWNLOAD: (id: string) => `/mix-sessions/${id}/download`,
} as const;
