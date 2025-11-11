// Domain: invitations
// Auto-generated from API structure analysis

import type { operations } from './globals.types';

export interface InvitationsPaths {
    "/invitations/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Envoyer une invitation par email */
        post: operations["InvitationsController_sendInvitation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lister toutes les invitations (paginé) */
        get: operations["InvitationsController_findAll"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invitations/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Valider un token d'invitation */
        get: operations["InvitationsController_validateToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invitations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Annuler une invitation */
        delete: operations["InvitationsController_cancelInvitation"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}

// Operations for this domain
export type InvitationsOperations = "InvitationsController_sendInvitation" | "InvitationsController_findAll" | "InvitationsController_validateToken" | "InvitationsController_cancelInvitation";

// Re-export individual operations  
export type InvitationssendInvitation = operations["InvitationsController_sendInvitation"];
export type InvitationsfindAll = operations["InvitationsController_findAll"];
export type InvitationsvalidateToken = operations["InvitationsController_validateToken"];
export type InvitationscancelInvitation = operations["InvitationsController_cancelInvitation"];
