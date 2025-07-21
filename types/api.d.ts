// Passerelle pour exposer globalement les types générés de l'API Nina.fm
// Ce fichier importe les types du fichier généré et les rend disponibles globalement

import type { components, operations, paths } from './api-generated'

declare global {
  // ===== TYPES PRINCIPAUX DE L'API =====

  // Types des composants (schemas)
  type ApiComponents = components
  type ApiSchemas = components['schemas']

  // Types des opérations
  type ApiOperations = operations

  // Types des chemins
  type ApiPaths = paths

  // ===== ENTITÉS PRINCIPALES =====

  /**
   * Utilisateur avec profil
   */
  type User = ApiSchemas['User']

  /**
   * Profil utilisateur
   */
  type Profile = ApiSchemas['Profile']

  /**
   * Image avec métadonnées
   */
  type Image = ApiSchemas['Image']

  /**
   * DJ
   */
  type Dj = ApiSchemas['Dj']

  /**
   * Tag avec couleur
   */
  type Tag = ApiSchemas['Tag']

  /**
   * Mixtape avec relations
   */
  type Mixtape = ApiSchemas['Mixtape']

  // ===== DTOs DE CRÉATION/MISE À JOUR =====

  /**
   * DTO pour créer un utilisateur
   */
  type CreateUserDto = ApiSchemas['CreateUserDto']

  /**
   * DTO pour mettre à jour un utilisateur
   */
  type UpdateUserDto = ApiSchemas['UpdateUserDto']

  /**
   * DTO pour mettre à jour un profil utilisateur
   */
  type UpdateUserProfileDto = ApiSchemas['UpdateUserProfileDto']

  /**
   * DTO pour créer un DJ
   */
  type CreateDjDto = ApiSchemas['CreateDjDto']

  /**
   * DTO pour mettre à jour un DJ
   */
  type UpdateDjDto = ApiSchemas['UpdateDjDto']

  /**
   * DTO pour créer un tag
   */
  type CreateTagDto = ApiSchemas['CreateTagDto']

  /**
   * DTO pour mettre à jour un tag
   */
  type UpdateTagDto = ApiSchemas['UpdateTagDto']

  /**
   * DTO pour créer une mixtape
   */
  type CreateMixtapeDto = ApiSchemas['CreateMixtapeDto']

  /**
   * DTO pour mettre à jour une mixtape
   */
  type UpdateMixtapeDto = ApiSchemas['UpdateMixtapeDto']

  /**
   * DTO pour ajouter des tags à une mixtape
   */
  type AddTagsToMixtapeDto = ApiSchemas['AddTagsToMixtapeDto']

  /**
   * DTO pour ajouter des DJs à une mixtape
   */
  type AddDjsToMixtapeDto = ApiSchemas['AddDjsToMixtapeDto']

  // ===== DTOs D'AUTHENTIFICATION =====

  /**
   * DTO pour la connexion
   */
  type SignInDto = ApiSchemas['SignInDto']

  /**
   * DTO pour l'inscription
   */
  type SignUpDto = ApiSchemas['SignUpDto']

  /**
   * DTO pour le refresh token
   */
  type RefreshTokenDto = ApiSchemas['RefreshTokenDto']

  // ===== RÉPONSES DE LISTE =====

  /**
   * Réponse de liste d'utilisateurs
   */
  type UsersListResponseDto = ApiSchemas['UsersListResponseDto']

  /**
   * Réponse de liste de DJs
   */
  type DjsListResponseDto = ApiSchemas['DjsListResponseDto']

  /**
   * Réponse de liste de tags
   */
  type TagsListResponseDto = ApiSchemas['TagsListResponseDto']

  /**
   * Réponse de liste de mixtapes
   */
  type MixtapesListResponseDto = ApiSchemas['MixtapesListResponseDto']

  // ===== RÉPONSES INDIVIDUELLES =====

  /**
   * Réponse d'un DJ
   */
  type DjResponseDto = ApiSchemas['DjResponseDto']

  /**
   * Réponse d'un tag
   */
  type TagResponseDto = ApiSchemas['TagResponseDto']

  /**
   * Réponse d'une mixtape
   */
  type MixtapeResponseDto = ApiSchemas['MixtapeResponseDto']

  // ===== TYPES DE STREAMING =====

  /**
   * Données IceCast
   */
  type IceCastDataDto = ApiSchemas['IceCastDataDto']

  /**
   * Données AirTime
   */
  type AirTimeDataDto = ApiSchemas['AirTimeDataDto']

  /**
   * Données d'événements combinés
   */
  type EventsDataDto = ApiSchemas['EventsDataDto']

  /**
   * Réponse d'événements
   */
  type EventsResponseDto = ApiSchemas['EventsResponseDto']

  /**
   * Réponse de listeners
   */
  type ListenersResponseDto = ApiSchemas['ListenersResponseDto']

  /**
   * Réponse de progression
   */
  type ProgressResponseDto = ApiSchemas['ProgressResponseDto']
}

export {}
