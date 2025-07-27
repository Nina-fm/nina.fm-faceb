// Passerelle pour exposer globalement les types générés de l'API Nina.fm
// Ce fichier importe les types du fichier généré et les rend disponibles globalement

import type { components, operations, paths } from './api-generated'

declare global {

  // ===== TYPES PRINCIPAUX DE L'API =====
  type ApiComponents = components
  type ApiSchemas = components['schemas']
  type ApiOperations = operations
  type ApiPaths = paths

  // ===== ENTITÉS PRINCIPALES =====

  /**
   * DJ
   */
  type Dj = ApiSchemas['Dj']

  /**
   * Image avec métadonnées
   */
  type Image = ApiSchemas['Image']

  /**
   * Invitation utilisateur
   */
  type Invitation = ApiSchemas['Invitation']

  /**
   * Mixtape avec relations
   */
  type Mixtape = ApiSchemas['Mixtape']

  /**
   * Profil utilisateur
   */
  type Profile = ApiSchemas['Profile']

  /**
   * Tag avec couleur
   */
  type Tag = ApiSchemas['Tag']

  /**
   * Utilisateur avec profil
   */
  type User = ApiSchemas['User']


  // ===== DTOs DE CRÉATION/MISE À JOUR =====

  type AddDjsToMixtapeDto = ApiSchemas['AddDjsToMixtapeDto']

  type AddTagsToMixtapeDto = ApiSchemas['AddTagsToMixtapeDto']

  type CreateDjDto = ApiSchemas['CreateDjDto']

  type CreateMixtapeDto = ApiSchemas['CreateMixtapeDto']

  type CreateTagDto = ApiSchemas['CreateTagDto']

  type CreateUserDto = ApiSchemas['CreateUserDto']

  type UpdateDjDto = ApiSchemas['UpdateDjDto']

  type UpdateMixtapeDto = ApiSchemas['UpdateMixtapeDto']

  type UpdateTagDto = ApiSchemas['UpdateTagDto']

  type UpdateUserDto = ApiSchemas['UpdateUserDto']

  type UpdateUserProfileDto = ApiSchemas['UpdateUserProfileDto']


  // ===== DTOs D'AUTHENTIFICATION =====

  type ForgotPasswordDto = ApiSchemas['ForgotPasswordDto']

  type RefreshTokenDto = ApiSchemas['RefreshTokenDto']

  type ResetPasswordDto = ApiSchemas['ResetPasswordDto']

  type SignInDto = ApiSchemas['SignInDto']

  type SignUpDto = ApiSchemas['SignUpDto']


  // ===== RÉPONSES DE LISTE =====

  type DjsListResponseDto = ApiSchemas['DjsListResponseDto']

  type InvitationsListResponseDto = ApiSchemas['InvitationsListResponseDto']

  type MixtapesListResponseDto = ApiSchemas['MixtapesListResponseDto']

  type TagsListResponseDto = ApiSchemas['TagsListResponseDto']

  type UsersListResponseDto = ApiSchemas['UsersListResponseDto']


  // ===== RÉPONSES INDIVIDUELLES =====

  type DjResponseDto = ApiSchemas['DjResponseDto']

  type EventsResponseDto = ApiSchemas['EventsResponseDto']

  type ListenersResponseDto = ApiSchemas['ListenersResponseDto']

  type MixtapeResponseDto = ApiSchemas['MixtapeResponseDto']

  type ProgressResponseDto = ApiSchemas['ProgressResponseDto']

  type TagResponseDto = ApiSchemas['TagResponseDto']

  type UserResponseDto = ApiSchemas['UserResponseDto']


  // ===== TYPES DE STREAMING =====

  type AirTimeDataDto = ApiSchemas['AirTimeDataDto']

  type EventsDataDto = ApiSchemas['EventsDataDto']

  type EventsResponseDto = ApiSchemas['EventsResponseDto']

  type IceCastDataDto = ApiSchemas['IceCastDataDto']

  type ListenersResponseDto = ApiSchemas['ListenersResponseDto']

  type ProgressResponseDto = ApiSchemas['ProgressResponseDto']

}

export {}
