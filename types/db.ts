/**
 * Types de base de données
 * Ré-exporte des schemas de l'API pour une utilisation plus pratique
 */

import type { components } from '~/types/api'

// Entités principales
export type User = components['schemas']['User']
export type Profile = components['schemas']['Profile']
export type Tag = components['schemas']['Tag']
export type Dj = components['schemas']['Dj']
export type Mixtape = components['schemas']['Mixtape']
export type ImageFile = components['schemas']['ImageFile']
export type AudioFile = components['schemas']['AudioFile']
export type Invitation = components['schemas']['Invitation']
export type MixSession = components['schemas']['MixSession']
export type SessionTrack = components['schemas']['SessionTrack']

// Variantes spéciales
export type DjWithMixtapesCount = components['schemas']['DjWithMixtapesCount']
export type ProfileDto = components['schemas']['ProfileDto']
export type UserWithProfileDto = components['schemas']['UserWithProfileDto']
