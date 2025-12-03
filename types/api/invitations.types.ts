// Domain: invitations
// Auto-generated from API structure analysis

import type { components, operations } from './globals.types'

export interface InvitationsPaths {
  '/invitations/send': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Envoyer une invitation par email */
    post: operations['InvitationsController_sendInvitation']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/invitations': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Lister toutes les invitations (paginé) */
    get: operations['InvitationsController_findAll']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/invitations/validate': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Valider un token d'invitation */
    get: operations['InvitationsController_validateToken']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/invitations/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /** Annuler une invitation */
    delete: operations['InvitationsController_cancelInvitation']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}

// Operations for this domain
export type InvitationsOperations =
  | 'InvitationsController_sendInvitation'
  | 'InvitationsController_findAll'
  | 'InvitationsController_validateToken'
  | 'InvitationsController_cancelInvitation'

// ===== TYPES =====

export type Invitation = components['schemas']['Invitation']
export type InvitationsQueryDto = components['schemas']['InvitationsQueryDto']
export type ValidateInvitationTokenResponseDto = components['schemas']['ValidateInvitationTokenResponseDto']
export type SendInvitationDto = components['schemas']['SendInvitationDto']
export type InvitationDto = components['schemas']['InvitationDto']
export type InvitationsListResponseDto = components['schemas']['InvitationsListResponseDto']

// ===== ENDPOINTS =====

export const INVITATIONS_ENDPOINTS = {
  SEND: '/invitations/send',
  BASE: '/invitations',
  VALIDATE: '/invitations/validate',
  BY_ID: (id: string) => `/invitations/${id}`,
  RESEND: (id: string) => `/invitations/${id}/resend`,
} as const
