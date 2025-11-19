// Global API types
// Contains the complete interfaces needed for openapi-fetch

export interface paths {
  '/auth/login': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** User login */
    post: operations['AuthController_signIn']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/register': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** User registration */
    post: operations['AuthController_signUp']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/refresh': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Refresh access token */
    post: operations['AuthController_refreshTokens']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/logout': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** User logout */
    post: operations['AuthController_signOut']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/profile': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get current user profile */
    get: operations['AuthController_getProfile']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/forgot-password': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Request password reset */
    post: operations['AuthController_forgotPassword']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/reset-password': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Reset password with token */
    post: operations['AuthController_resetPassword']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/users': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all users with pagination and filters
     * @description Retrieve a paginated list of users with optional filtering by role and profile status. Requires authentication and admin privileges.
     */
    get: operations['UsersController_findAll']
    put?: never
    /**
     * Create a new user
     * @description Create a new user account. Requires authentication and admin privileges.
     */
    post: operations['UsersController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/users/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get user by ID
     * @description Retrieve a specific user by their ID. Users can only access their own profile unless they have admin privileges.
     */
    get: operations['UsersController_findOne']
    put?: never
    post?: never
    /**
     * Delete user
     * @description Delete an existing user. Requires authentication and admin privileges.
     */
    delete: operations['UsersController_remove']
    options?: never
    head?: never
    /**
     * Update user
     * @description Update an existing user. Requires authentication and admin privileges.
     */
    patch: operations['UsersController_update']
    trace?: never
  }
  '/users/{id}/profile': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Create user profile
     * @description Create a profile for a user. Requires authentication and admin privileges.
     */
    post: operations['UsersController_createProfile']
    delete?: never
    options?: never
    head?: never
    /**
     * Update user profile
     * @description Update a user's profile information. All users can update their own profile.
     */
    patch: operations['UsersController_updateProfile']
    trace?: never
  }
  '/files/audio': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all audio files
     * @description Retrieve a list of all uploaded audio files.
     */
    get: operations['AudioFilesController_findAll']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/upload': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Upload an audio file
     * @description Upload an audio file with automatic processing and metadata extraction.
     */
    post: operations['AudioFilesController_upload']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get audio file details
     * @description Retrieve audio file metadata and information.
     */
    get: operations['AudioFilesController_findOne']
    put?: never
    post?: never
    /**
     * Delete audio file
     * @description Delete an audio file and its associated metadata permanently.
     */
    delete: operations['AudioFilesController_remove']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/{id}/stream': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream audio file
     * @description Stream the audio file content optimized for playback.
     */
    get: operations['AudioFilesController_stream']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/audio/{path}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve audio file by full URI path
     * @description Serve audio file using the complete URI path stored in database.
     */
    get: operations['AudioFilesController_serveByFullUri']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/upload': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Upload an image file
     * @description Upload an image file with automatic processing and thumbnail generation.
     */
    post: operations['ImageFilesController_upload']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get images by bucket
     * @description Retrieve all images from a specific bucket. The bucket parameter is required.
     */
    get: operations['ImageFilesController_findByBucket']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/metadata/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get image metadata by ID
     * @description Retrieve metadata for a specific image by its ID.
     */
    get: operations['ImageFilesController_findOne']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve image file by ID
     * @description Serve the original image file by its ID.
     */
    get: operations['ImageFilesController_serveImageById']
    put?: never
    post?: never
    /**
     * Delete image
     * @description Delete an existing image and its files.
     */
    delete: operations['ImageFilesController_remove']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/{id}/thumbnail': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve image thumbnail by ID
     * @description Serve the thumbnail version of an image by its ID.
     */
    get: operations['ImageFilesController_serveThumbnailById']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/{path}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve image file by full URI path
     * @description Serve image file using the complete URI path stored in database. Supports both original and thumbnail images.
     */
    get: operations['ImageFilesController_serveByFullUri']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/images/{bucket}/{filename}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve image file by URI (compatibility)
     * @description Serve the original image file using bucket/filename URI format.
     */
    get: operations['ImageFilesController_serveByUri']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/files/images/images/{bucket}/thumb/{filename}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Serve thumbnail by URI (compatibility)
     * @description Serve the thumbnail image file using bucket/thumb/filename URI format.
     */
    get: operations['ImageFilesController_serveThumbnailByUri']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
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
  '/health': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Health check endpoint */
    get: operations['HealthController_healthCheck']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/debug/listeners': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for listeners data
     * @description Returns current listeners data for debugging purposes.
     */
    get: operations['StreamController_debugListeners']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/debug/progress': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for progress data
     * @description Returns current progress data for debugging purposes.
     */
    get: operations['StreamController_debugProgress']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/debug/events': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for events data
     * @description Returns current events data for debugging purposes.
     */
    get: operations['StreamController_debugEvents']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/debug/all': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Debug endpoint for all stream data
     * @description Returns complete debug information for all streams.
     */
    get: operations['StreamController_debugAll']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/events': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream events via Server-Sent Events
     * @description Real-time stream of combined AirTime and IceCast data including current track info, show details, and streaming metadata.
     */
    get: operations['StreamController_events']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/listeners': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream listeners count via Server-Sent Events
     * @description Real-time stream of current listeners count from IceCast server.
     */
    get: operations['StreamController_listeners']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/progress': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream track progress via Server-Sent Events
     * @description Real-time stream of current track progress percentage from AirTime scheduler.
     */
    get: operations['StreamController_progress']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/metadata': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream enriched metadata via Server-Sent Events
     * @description Real-time stream of enriched metadata (mixtape or track info) that emits only when the track/mixtape changes. Includes full mixtape details from database when available.
     */
    get: operations['StreamController_metadata']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/stream/activity': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream activity data (progress + listeners) via Server-Sent Events
     * @description Real-time stream combining progress percentage and listeners count. Updates every ~3 seconds. No database queries.
     */
    get: operations['StreamController_activity']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all mixtapes with pagination and filters
     * @description Retrieve a paginated list of mixtapes with optional filtering by tags, DJ, year range, and search. Supports sorting and pagination.
     */
    get: operations['MixtapesController_findAll']
    put?: never
    /**
     * Create a new mixtape
     * @description Create a new mixtape with optional tags that will be auto-created if they don't exist. Requires authentication.
     */
    post: operations['MixtapesController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/years': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all available years
     * @description Retrieve a list of all unique years from existing mixtapes, sorted in descending order.
     */
    get: operations['MixtapesController_getAvailableYears']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get mixtape by ID
     * @description Retrieve a specific mixtape by its ID with cover information. Requires authentication.
     */
    get: operations['MixtapesController_findOne']
    put?: never
    post?: never
    /**
     * Delete mixtape
     * @description Delete an existing mixtape and its associated cover image. Requires authentication.
     */
    delete: operations['MixtapesController_remove']
    options?: never
    head?: never
    /**
     * Update mixtape
     * @description Update an existing mixtape. Requires authentication.
     */
    patch: operations['MixtapesController_update']
    trace?: never
  }
  '/mixtapes/{id}/cover/{imageId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    /**
     * Set mixtape cover
     * @description Associate an image as the cover for a mixtape. Requires authentication.
     */
    put: operations['MixtapesController_updateCover']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/cover': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /**
     * Remove mixtape cover
     * @description Remove the cover from a mixtape and delete the associated image file.
     */
    delete: operations['MixtapesController_removeCover']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/tags': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get mixtape tags
     * @description Retrieve all tags associated with a specific mixtape.
     */
    get: operations['MixtapesController_getMixtapeTags']
    put?: never
    /**
     * Add tags to mixtape
     * @description Add multiple tags to a mixtape. Tags will be created automatically if they do not exist.
     */
    post: operations['MixtapesController_addTagsToMixtape']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/tags/{tagId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /**
     * Remove tag from mixtape
     * @description Remove a specific tag from a mixtape.
     */
    delete: operations['MixtapesController_removeTagFromMixtape']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/djs': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get mixtape DJs
     * @description Retrieve all DJs associated with a specific mixtape.
     */
    get: operations['MixtapesController_getMixtapeDjs']
    put?: never
    /**
     * Add DJs to mixtape
     * @description Add multiple DJs to a mixtape. DJs will be created automatically if they do not exist.
     */
    post: operations['MixtapesController_addDjsToMixtape']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mixtapes/{id}/djs/{djId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /**
     * Remove DJ from mixtape
     * @description Remove a specific DJ from a mixtape.
     */
    delete: operations['MixtapesController_removeDjFromMixtape']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/djs': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all DJs with pagination and filters
     * @description Retrieve all DJs with optional filtering by mixtape presence and search capabilities.
     */
    get: operations['DjsController_findAll']
    put?: never
    /**
     * Create a new DJ
     * @description Create a new DJ with automatic slug generation.
     */
    post: operations['DjsController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/djs/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get DJ by ID
     * @description Retrieve a specific DJ by their unique identifier.
     */
    get: operations['DjsController_findOne']
    put?: never
    post?: never
    /**
     * Delete DJ
     * @description Delete a DJ by ID.
     */
    delete: operations['DjsController_remove']
    options?: never
    head?: never
    /**
     * Update DJ
     * @description Update an existing DJ by ID.
     */
    patch: operations['DjsController_update']
    trace?: never
  }
  '/djs/{id}/mixtapes': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get DJ mixtapes
     * @description Retrieve all mixtapes associated with a specific DJ.
     */
    get: operations['DjsController_getDjMixtapes']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sessions/{sessionId}/tracks': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all tracks for a session
     * @description Retrieve all audio tracks for a given mix session.
     */
    get: operations['TracksController_findAll']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sessions/{sessionId}/tracks/upload': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Upload a track to a session
     * @description Upload an audio file to add to the mix session timeline.
     */
    post: operations['TracksController_upload']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sessions/{sessionId}/tracks/reorder': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    /**
     * Reorder tracks in timeline
     * @description Update the order of tracks in the mix session timeline.
     */
    patch: operations['TracksController_reorder']
    trace?: never
  }
  '/sessions/{sessionId}/tracks/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get track details
     * @description Retrieve track metadata and information.
     */
    get: operations['TracksController_findOne']
    put?: never
    post?: never
    /**
     * Delete track
     * @description Delete a track from the session and remove the audio file.
     */
    delete: operations['TracksController_remove']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/sessions/{sessionId}/tracks/{id}/stream': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Stream track audio
     * @description Stream the audio file content for playback.
     */
    get: operations['TracksController_stream']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mix-sessions': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Lister toutes les sessions de l'utilisateur */
    get: operations['MixSessionsController_findAll']
    put?: never
    /** Créer une nouvelle session de mix */
    post: operations['MixSessionsController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mix-sessions/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Récupérer une session spécifique */
    get: operations['MixSessionsController_findOne']
    put?: never
    post?: never
    /** Supprimer une session */
    delete: operations['MixSessionsController_remove']
    options?: never
    head?: never
    /** Mettre à jour une session */
    patch: operations['MixSessionsController_update']
    trace?: never
  }
  '/mix-sessions/{id}/export': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Exporter une session en fichier MP3 */
    post: operations['MixSessionsController_export']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/mix-sessions/{id}/download': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Télécharger le fichier MP3 exporté */
    get: operations['MixSessionsController_download']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/tags': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get all tags with pagination and filters
     * @description Retrieve all tags with optional filtering by usage in mixtapes and search capabilities.
     */
    get: operations['TagsController_findAll']
    put?: never
    /**
     * Create a new tag
     * @description Create a new tag with automatic slug generation.
     */
    post: operations['TagsController_create']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/tags/{id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get tag by ID
     * @description Retrieve a specific tag by its unique identifier.
     */
    get: operations['TagsController_findOne']
    put?: never
    post?: never
    /**
     * Delete tag
     * @description Delete a tag by ID.
     */
    delete: operations['TagsController_remove']
    options?: never
    head?: never
    /**
     * Update tag
     * @description Update an existing tag by ID.
     */
    patch: operations['TagsController_update']
    trace?: never
  }
  '/tags/{id}/mixtapes': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Get tag mixtapes
     * @description Retrieve all mixtapes associated with a specific tag.
     */
    get: operations['TagsController_getTagMixtapes']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>

export interface components {
  schemas: {
    SignInDto: {
      email: string
      password: string
    }
    SignUpDto: {
      email: string
      password: string
      name?: string
      /** @description Invitation token to validate and mark as used */
      invitationToken?: string
    }
    Invitation: {
      /** Format: uuid */
      id: string
      email: string
      token: string
      /** Format: date-time */
      usedAt: string | null
      /** Format: date-time */
      expiresAt: string
      invitedBy: components['schemas']['User']
      /** Format: date-time */
      createdAt: string
      /** Format: date-time */
      updatedAt: string
    }
    User: {
      /** @description User unique identifier */
      id: string
      /** @description User email address */
      email: string
      /**
       * @description User role
       * @enum {string}
       */
      role: 'ADMIN' | 'MANAGER' | 'CONTRIBUTOR' | 'VIEWER' | 'PUBLIC'
      /**
       * Format: date-time
       * @description User creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description User last update date
       */
      updatedAt: string
      /** @description Associated profile */
      profile: components['schemas']['Profile']
      /** @description Invitations sent by the user */
      invitations: components['schemas']['Invitation'][]
      /** @description Images uploaded by the user */
      images: components['schemas']['ImageFile'][]
    }
    ImageFile: {
      /** @description File unique identifier */
      id: string
      /**
       * @description File type
       * @enum {string}
       */
      fileType: 'image' | 'audio' | 'document' | 'video'
      /** @description Original filename */
      originalName: string
      /** @description Storage bucket */
      bucket: string
      /** @description MIME type */
      mimeType: string
      /** @description File size in bytes */
      size: number
      /** @description URI path of the file */
      uri: string
      /** @description Processed version URI */
      processedUri?: string
      /** @description Created by user */
      createdBy?: components['schemas']['User']
      /**
       * Format: date-time
       * @description File creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description File last update date
       */
      updatedAt: string
      /** @description Image width in pixels */
      width: number
      /** @description Image height in pixels */
      height: number
      /** @description Thumbnail URI path */
      thumbUri?: string
    }
    Profile: {
      /** @description Profile unique identifier */
      id: string
      /** @description User nickname */
      nickname: string
      /** @description User description */
      description?: string
      /**
       * Format: date-time
       * @description Profile creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description Profile last update date
       */
      updatedAt: string
      /** @description User avatar */
      avatar?: components['schemas']['ImageFile']
    }
    ForgotPasswordDto: {
      /**
       * @description User email address
       * @example user@example.com
       */
      email: string
    }
    ResetPasswordDto: {
      /**
       * @description Reset password token
       * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
       */
      token: string
      /**
       * @description New password
       * @example NewSecurePassword123!
       */
      password: string
    }
    UsersQueryDto: {
      /**
       * @description Numéro de page (commence à 1)
       * @default 1
       * @example 1
       */
      page: number
      /**
       * @description Nombre d'éléments par page
       * @default 10
       * @example 10
       */
      limit: number
      /**
       * @description Champ de tri
       * @example createdAt
       */
      sortBy?: string
      /**
       * @description Ordre de tri
       * @default DESC
       * @example DESC
       * @enum {string}
       */
      sortOrder: 'ASC' | 'DESC'
      /**
       * @description Recherche textuelle globale
       * @example house music
       */
      search?: string
      /**
       * @description Filtrer par rôle utilisateur
       * @example VIEWER
       * @enum {string}
       */
      role?: 'ADMIN' | 'MANAGER' | 'CONTRIBUTOR' | 'VIEWER' | 'PUBLIC'
      /**
       * @description Filtrer par utilisateurs ayant un profil défini
       * @example true
       */
      hasProfile?: boolean
    }
    ProfileDto: {
      /** @description Profile unique identifier */
      id: string
      /** @description User nickname */
      nickname: string
      /** @description User description */
      description?: string | null
      /** @description User avatar */
      avatar?: components['schemas']['ImageFile'] | null
      /**
       * Format: date-time
       * @description Profile creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description Profile last update date
       */
      updatedAt: string
    }
    UsersListResponseDto: {
      /** @description Pagination metadata */
      pagination: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
        hasNext?: boolean
        hasPrev?: boolean
      }
      /** @description Applied filters */
      filters: {
        [key: string]: unknown
      }
      data: components['schemas']['User'][]
    }
    UserResponseDto: {
      data: components['schemas']['User']
    }
    CreateUserDto: {
      /**
       * Format: email
       * @description User email address
       * @example user@example.com
       */
      email: string
      /**
       * @description User password
       * @example SecurePassword123!
       */
      password: string
    }
    UpdateUserDto: {
      /**
       * Format: email
       * @description User email address
       * @example user@example.com
       */
      email?: string
      /**
       * @description User password
       * @example SecurePassword123!
       */
      password?: string
    }
    UpdateUserProfileDto: {
      /**
       * @description User nickname or display name
       * @example DJ_Cool_Name
       */
      nickname?: string
      /**
       * @description Profile description or bio
       * @example Passionate DJ mixing electronic and hip-hop music
       */
      description?: string
      /**
       * @description Avatar image ID (optional, null or empty string to remove avatar)
       * @example 456e4567-e89b-12d3-a456-426614174001
       */
      avatarId?: Record<string, never>
    }
    AudioFile: {
      /** @description File unique identifier */
      id: string
      /**
       * @description File type
       * @enum {string}
       */
      fileType: 'image' | 'audio' | 'document' | 'video'
      /** @description Original filename */
      originalName: string
      /** @description Storage bucket */
      bucket: string
      /** @description MIME type */
      mimeType: string
      /** @description File size in bytes */
      size: number
      /** @description URI path of the file */
      uri: string
      /** @description Processed version URI */
      processedUri?: string
      /** @description Created by user */
      createdBy?: components['schemas']['User']
      /**
       * Format: date-time
       * @description File creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description File last update date
       */
      updatedAt: string
      /** @description Audio duration in seconds */
      duration: number
      /** @description Audio bitrate in kbps */
      bitrate?: number
      /** @description Sample rate in Hz */
      sampleRate?: number
      /** @description Number of audio channels */
      channels?: number
      /** @description BPM (Beats Per Minute) */
      bpm?: number
      /** @description Musical key */
      musicalKey?: string
      /** @description Artist name */
      artist?: string
      /** @description Track title */
      title?: string
      /** @description Album name */
      album?: string
      /** @description Genre */
      genre?: string
      /** @description Release year */
      year?: number
      /** @description Waveform data (JSON) */
      waveformData?: string
      /** @description Processing status */
      processingStatus?: string
    }
    InvitationsQueryDto: {
      /**
       * @description Numéro de page (commence à 1)
       * @default 1
       * @example 1
       */
      page: number
      /**
       * @description Nombre d'éléments par page
       * @default 10
       * @example 10
       */
      limit: number
      /**
       * @description Champ de tri
       * @example createdAt
       */
      sortBy?: string
      /**
       * @description Ordre de tri
       * @default DESC
       * @example DESC
       * @enum {string}
       */
      sortOrder: 'ASC' | 'DESC'
      /**
       * @description Recherche textuelle globale
       * @example house music
       */
      search?: string
    }
    ValidateInvitationTokenResponseDto: {
      /** @description Indicates if the token is valid */
      valid: boolean
      /** @description The invitation email */
      email: string
      /** @description The invitation message */
      message: string
    }
    UserWithProfileDto: {
      /** @description User unique identifier */
      id: string
      /** @description User email address */
      email: string
      /**
       * @description User role
       * @enum {string}
       */
      role: 'ADMIN' | 'MANAGER' | 'CONTRIBUTOR' | 'VIEWER'
      /**
       * Format: date-time
       * @description User creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description User last update date
       */
      updatedAt: string
      profile: components['schemas']['ProfileDto']
    }
    SendInvitationDto: {
      /**
       * @description Email de la personne à inviter
       * @example john.doe@example.com
       */
      email: string
      /**
       * @description Message personnalisé optionnel pour l'invitation
       * @example Rejoignez-nous sur Nina.fm !
       */
      message?: string
    }
    InvitationDto: {
      /** Format: uuid */
      id: string
      email: string
      token: string
      /** Format: date-time */
      usedAt: string | null
      /** Format: date-time */
      expiresAt: string
      invitedBy: components['schemas']['User']
      /** Format: date-time */
      createdAt: string
      /** Format: date-time */
      updatedAt: string
    }
    InvitationsListResponseDto: {
      /** @description Pagination metadata */
      pagination: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
        hasNext?: boolean
        hasPrev?: boolean
      }
      /** @description Applied filters */
      filters: {
        [key: string]: unknown
      }
      /** @description The list of invitations */
      data: components['schemas']['InvitationDto'][]
    }
    IceCastDataDto: {
      /**
       * @description Audio info
       * @example mp3;44100;2
       */
      audio_info: string
      /**
       * @description Number of channels
       * @example 2
       */
      channels: number
      /**
       * @description Genre
       * @example Various
       */
      genre: string
      /**
       * @description Peak listeners count
       * @example 100
       */
      listener_peak: number
      /**
       * @description Current listeners count
       * @example 42
       */
      listeners: number
      /**
       * @description Listen URL
       * @example http://stream.nina.fm:8000/stream.mp3
       */
      listenurl: string
      /**
       * @description Sample rate
       * @example 44100
       */
      samplerate: number
      /**
       * @description Server description
       * @example NINA.FM
       */
      server_description: string
      /**
       * @description Server name
       * @example NINA.FM
       */
      server_name: string
      /**
       * @description Server type
       * @example icecast
       */
      server_type: string
      /**
       * @description Server URL
       * @example https://nina.fm
       */
      server_url: string
      /**
       * @description Stream start time
       * @example Mon, 01 Jul 2025 10:00:00 +0000
       */
      stream_start: string
      /**
       * @description Stream start time in ISO8601
       * @example 2025-07-01T10:00:00Z
       */
      stream_start_iso8601: string
      /**
       * @description Current track title
       * @example Artist - Track
       */
      title: string
    }
    AirTimeDataDto: {
      /**
       * @description Environment
       * @example production
       */
      env: string
      /**
       * @description Current time on scheduler
       * @example 2025-07-01 10:30:45
       */
      schedulerTime: string
      /** @description Previous track info */
      previous: Record<string, never>
      /** @description Current track info */
      current: Record<string, never>
      /** @description Next track info */
      next: Record<string, never>
      /** @description Current show info */
      currentShow: string[]
      /** @description Next show info */
      nextShow: string[]
      /**
       * @description Timezone
       * @example Europe/Paris
       */
      timezone: string
      /**
       * @description Timezone offset
       * @example +0200
       */
      timezoneOffset: string
      /**
       * @description AirTime API version
       * @example 2.5.1
       */
      AIRTIME_API_VERSION: string
    }
    EventsDataDto: {
      /** @description IceCast data */
      icecast: components['schemas']['IceCastDataDto']
      /** @description AirTime data */
      airtime: components['schemas']['AirTimeDataDto']
    }
    EventsResponseDto: {
      /** @description Combined stream events data */
      data: components['schemas']['EventsDataDto']
    }
    ListenersResponseDto: {
      /**
       * @description Current number of listeners
       * @example 42
       */
      data: number
    }
    ProgressResponseDto: {
      /**
       * @description Progress percentage of current track (0-100)
       * @example 45.67
       */
      data: number
    }
    MixtapeMetadataDto: {
      /**
       * @description Mixtape unique identifier
       * @example 123e4567-e89b-12d3-a456-426614174000
       */
      id: string
      /**
       * @description Mixtape name
       * @example 900x450
       */
      name: string
      /**
       * @description Mixtape slug
       * @example 900x450
       */
      slug: string
      /**
       * @description Mixtape year
       * @example 2021
       */
      year: number
      /**
       * @description Cover image URL
       * @example https://api.nina.fm/files/images/covers/uuid-filename.png
       */
      coverUrl: Record<string, never> | null
      /**
       * @description List of DJs names
       * @example [
       *       "Hagi",
       *       "SKIII"
       *     ]
       */
      djs: string[]
      /**
       * @description List of tags names
       * @example [
       *       "jazz",
       *       "soul"
       *     ]
       */
      tags: string[]
      /**
       * @description Mixtape comment
       * @example A journey through time
       */
      comment: Record<string, never> | null
      /** @description Parsed tracks list */
      tracks: {
        /** @example 1 */
        position?: number
        /** @example Miles Davis */
        artist?: string
        /** @example So What */
        title?: string
        /** @example 00:05:12 */
        startAt?: string | null
      }[]
    }
    TrackMetadataDto: {
      /**
       * @description Track artist name
       * @example Miles Davis
       */
      artist: string
      /**
       * @description Track title
       * @example So What
       */
      title: string
    }
    MetadataStreamDto: {
      /**
       * @description Type of content currently playing
       * @example mixtape
       * @enum {string|null}
       */
      type: 'mixtape' | 'track' | null
      /** @description Mixtape metadata (when type is "mixtape") */
      mixtape?: components['schemas']['MixtapeMetadataDto'] | null
      /** @description Track metadata (when type is "track") */
      track?: components['schemas']['TrackMetadataDto'] | null
    }
    ActivityStreamDto: {
      /**
       * @description Current track progress percentage (0-100)
       * @example 67
       */
      progress: number
      /**
       * @description Current number of listeners
       * @example 42
       */
      listeners: number
    }
    MixtapesQueryDto: {
      /**
       * @description Numéro de page (commence à 1)
       * @default 1
       * @example 1
       */
      page: number
      /**
       * @description Nombre d'éléments par page
       * @default 10
       * @example 10
       */
      limit: number
      /**
       * @description Champ de tri
       * @example createdAt
       */
      sortBy?: string
      /**
       * @description Ordre de tri
       * @default DESC
       * @example DESC
       * @enum {string}
       */
      sortOrder: 'ASC' | 'DESC'
      /**
       * @description Recherche textuelle globale
       * @example house music
       */
      search?: string
      /**
       * @description Filtrer par tags (noms)
       * @example [
       *       "house",
       *       "techno"
       *     ]
       */
      tags?: string[]
      /**
       * @description Filtrer par DJs (noms ou slugs)
       * @example [
       *       "john-doe",
       *       "jane-smith"
       *     ]
       */
      djs?: string[]
      /**
       * @description Filtrer par année exacte
       * @example 2024
       */
      year?: number
      /**
       * @description Filtrer par année minimum
       * @example 2020
       */
      yearFrom?: number
      /**
       * @description Filtrer par année maximum
       * @example 2024
       */
      yearTo?: number
    }
    Tag: {
      /** @description Tag unique identifier */
      id: string
      /** @description Tag name */
      name: string
      /** @description Tag slug */
      slug: string
      /** @description Tag color */
      color: string
      /** @description Tag mixtapes */
      mixtapes: components['schemas']['Mixtape'][]
      /** @description Created by user */
      createdBy?: components['schemas']['User']
      /**
       * Format: date-time
       * @description Tag creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description Tag last update date
       */
      updatedAt: string
    }
    Dj: {
      /** @description DJ unique identifier */
      id: string
      /** @description DJ name */
      name: string
      /** @description DJ slug */
      slug: string
      /**
       * Format: date-time
       * @description DJ creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description DJ last update date
       */
      updatedAt: string
      /** @description Created by user */
      createdBy?: components['schemas']['User']
      /** @description DJ mixtapes */
      mixtapes: components['schemas']['Mixtape'][]
      /** @description Year of the first mixtape */
      firstMixtapeYear?: number
    }
    Mixtape: {
      /** @description Mixtape unique identifier */
      id: string
      /** @description Mixtape name */
      name: string
      /** @description Mixtape slug */
      slug: string
      /** @description Mixtape year */
      year: number
      /** @description Tracks as text */
      tracksAsText?: string
      /** @description Mixtape description */
      description?: string
      /** @description Mixtape comment */
      comment?: string
      /**
       * Format: date-time
       * @description Mixtape creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description Mixtape last update date
       */
      updatedAt: string
      /** @description Mixtape cover */
      cover?: components['schemas']['ImageFile']
      /** @description Mixtape tags */
      tags: components['schemas']['Tag'][]
      /** @description Mixtape DJs */
      djs: components['schemas']['Dj'][]
      /** @description Created by user */
      createdBy?: components['schemas']['User']
    }
    MixtapesListResponseDto: {
      /** @description Pagination metadata */
      pagination: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
        hasNext?: boolean
        hasPrev?: boolean
      }
      /** @description Applied filters */
      filters: {
        [key: string]: unknown
      }
      /** @description The list of mixtapes */
      data: components['schemas']['Mixtape'][]
    }
    MixtapeResponseDto: {
      /** @description The mixtape data */
      data: components['schemas']['Mixtape']
    }
    CreateMixtapeDto: {
      /**
       * @description Mixtape name
       * @example Summer Vibes 2024
       */
      name: string
      /**
       * @description Release year
       * @example 2024
       */
      year: number
      /**
       * @description Tracks as text format
       * @example 1. Track One
       *     2. Track Two
       *     3. Track Three
       */
      tracksAsText?: string
      /**
       * @description Mixtape description
       * @example A collection of summer hits
       */
      description?: string
      /**
       * @description Additional comments
       * @example Mixed by DJ Name
       */
      comment?: string
      /**
       * @description Cover image ID
       * @example 123e4567-e89b-12d3-a456-426614174000
       */
      coverId?: string
      /**
       * @description Array of tag names to associate with the mixtape (tags will be auto-created if they don't exist)
       * @example [
       *       "Electronic",
       *       "Deep House",
       *       "Summer"
       *     ]
       */
      tagNames?: string[]
      /**
       * @description Array of DJ names to associate with the mixtape (DJs will be auto-created if they don't exist)
       * @example [
       *       "DJ Shadow",
       *       "Bonobo",
       *       "Thievery Corporation"
       *     ]
       */
      djNames?: string[]
      /**
       * @description Default color for auto-created tags (hex format)
       * @default #6B7280
       * @example #3B82F6
       */
      defaultTagColor: string
    }
    UpdateMixtapeDto: {
      /**
       * @description Mixtape name
       * @example Summer Vibes 2024
       */
      name?: string
      /**
       * @description Release year
       * @example 2024
       */
      year?: number
      /**
       * @description Tracks as text format
       * @example 1. Track One
       *     2. Track Two
       *     3. Track Three
       */
      tracksAsText?: string
      /**
       * @description Mixtape description
       * @example A collection of summer hits
       */
      description?: string
      /**
       * @description Additional comments
       * @example Mixed by DJ Name
       */
      comment?: string
      /**
       * @description Cover image ID
       * @example 123e4567-e89b-12d3-a456-426614174000
       */
      coverId?: string
      /**
       * @description Array of tag names to associate with the mixtape (tags will be auto-created if they don't exist)
       * @example [
       *       "Electronic",
       *       "Deep House",
       *       "Summer"
       *     ]
       */
      tagNames?: string[]
      /**
       * @description Array of DJ names to associate with the mixtape (DJs will be auto-created if they don't exist)
       * @example [
       *       "DJ Shadow",
       *       "Bonobo",
       *       "Thievery Corporation"
       *     ]
       */
      djNames?: string[]
      /**
       * @description Default color for auto-created tags (hex format)
       * @default #6B7280
       * @example #3B82F6
       */
      defaultTagColor: string
    }
    AddTagsToMixtapeDto: {
      /**
       * @description Array of tag names to add to the mixtape
       * @example [
       *       "Electronic",
       *       "Deep House",
       *       "Ambient"
       *     ]
       */
      tagNames: string[]
      /**
       * @description Default color for auto-created tags (hex format)
       * @default #6B7280
       * @example #3B82F6
       */
      defaultColor: string
    }
    AddDjsToMixtapeDto: {
      /**
       * @description List of DJ names to add to the mixtape
       * @example [
       *       "DJ Shadow",
       *       "Bonobo",
       *       "Thievery Corporation"
       *     ]
       */
      djNames: string[]
    }
    DjsQueryDto: {
      /**
       * @description Numéro de page (commence à 1)
       * @default 1
       * @example 1
       */
      page: number
      /**
       * @description Nombre d'éléments par page
       * @default 10
       * @example 10
       */
      limit: number
      /**
       * @description Champ de tri
       * @example createdAt
       */
      sortBy?: string
      /**
       * @description Ordre de tri
       * @default DESC
       * @example DESC
       * @enum {string}
       */
      sortOrder: 'ASC' | 'DESC'
      /**
       * @description Recherche textuelle globale
       * @example house music
       */
      search?: string
      /**
       * @description Filtrer par DJs ayant des mixtapes
       * @example true
       */
      hasMixtapes?: boolean
    }
    DjWithMixtapesCount: {
      /** @description DJ unique identifier */
      id: string
      /** @description DJ name */
      name: string
      /** @description DJ slug */
      slug: string
      /**
       * Format: date-time
       * @description DJ creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description DJ last update date
       */
      updatedAt: string
      /** @description Created by user */
      createdBy?: components['schemas']['User']
      /** @description DJ mixtapes */
      mixtapes: components['schemas']['Mixtape'][]
      /** @description Year of the first mixtape */
      firstMixtapeYear?: number
    }
    DjsListResponseDto: {
      /** @description Pagination metadata */
      pagination: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
        hasNext?: boolean
        hasPrev?: boolean
      }
      /** @description Applied filters */
      filters: {
        [key: string]: unknown
      }
      /** @description The list of DJs */
      data: components['schemas']['DjWithMixtapesCount'][]
    }
    DjResponseDto: {
      /** @description The DJ data */
      data: components['schemas']['Dj']
    }
    CreateDjDto: {
      /**
       * @description DJ name
       * @example DJ Shadow
       */
      name: string
    }
    UpdateDjDto: {
      /**
       * @description DJ name
       * @example DJ Shadow
       */
      name?: string
    }
    SessionTrack: {
      /** @description Track unique identifier */
      id: string
      /** @description Session ID this track belongs to */
      sessionId: string
      /** @description Parent session */
      session: components['schemas']['MixSession']
      /** @description Related mixtape ID */
      mixtapeId?: Record<string, never>
      /** @description Related mixtape */
      mixtape?: components['schemas']['Mixtape']
      /**
       * @description Stored filename
       * @example a1b2c3d4-track.mp3
       */
      filename: string
      /**
       * @description Original uploaded filename
       * @example my-awesome-track.mp3
       */
      originalName: string
      /**
       * @description File MIME type
       * @example audio/mpeg
       */
      mimeType: string
      /**
       * @description File size in bytes
       * @example 5242880
       */
      fileSizeBytes: number
      /**
       * @description Storage path on disk
       * @example uploads/audio/mix-sessions/xxx/tracks/original/file.mp3
       */
      storagePath: string
      /**
       * @description Track order in timeline
       * @example 0
       */
      trackOrder: number
      /**
       * Format: date-time
       * @description Upload date
       */
      uploadedAt: string
      /**
       * Format: date-time
       * @description Creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description Last update date
       */
      updatedAt: string
    }
    MixSession: {
      /** @description Session unique identifier */
      id: string
      /**
       * @description Session name
       * @example My Summer Mix
       */
      name: string
      /**
       * @description Session description
       * @example A collection of my favorite summer tracks
       */
      description?: Record<string, never>
      /**
       * @description Session status
       * @example draft
       * @enum {string}
       */
      status: 'draft' | 'in_progress' | 'completed' | 'exported'
      /** @description Creator user ID */
      createdById?: Record<string, never>
      /** @description Creator user */
      createdBy?: components['schemas']['User']
      /** @description Related mixtape ID */
      mixtapeId?: Record<string, never>
      /** @description Related mixtape */
      mixtape?: components['schemas']['Mixtape']
      /** @description Session tracks */
      tracks: components['schemas']['SessionTrack'][]
      /**
       * Format: date-time
       * @description Creation date
       */
      createdAt: string
      /**
       * Format: date-time
       * @description Last update date
       */
      updatedAt: string
      /** @description Export date */
      exportedAt?: Record<string, never>
    }
    ReorderTracksDto: {
      /**
       * @description Array of track IDs in desired order
       * @example [
       *       "123e4567-e89b-12d3-a456-426614174001",
       *       "123e4567-e89b-12d3-a456-426614174002",
       *       "123e4567-e89b-12d3-a456-426614174003"
       *     ]
       */
      trackIds: string[]
    }
    CreateMixSessionDto: {
      /**
       * @description Nom de la session de mix
       * @example Ma première mixtape
       */
      name: string
      /**
       * @description Description de la session
       * @example Un mix de mes meilleurs morceaux techno
       */
      description?: string
    }
    UpdateMixSessionDto: {
      /** @description Nom de la session */
      name?: string
      /** @description Description de la session */
      description?: string
      /**
       * @description Statut de la session
       * @enum {string}
       */
      status?: 'draft' | 'in_progress' | 'completed' | 'exported'
    }
    TagsQueryDto: {
      /**
       * @description Numéro de page (commence à 1)
       * @default 1
       * @example 1
       */
      page: number
      /**
       * @description Nombre d'éléments par page
       * @default 10
       * @example 10
       */
      limit: number
      /**
       * @description Champ de tri
       * @example createdAt
       */
      sortBy?: string
      /**
       * @description Ordre de tri
       * @default DESC
       * @example DESC
       * @enum {string}
       */
      sortOrder: 'ASC' | 'DESC'
      /**
       * @description Recherche textuelle globale
       * @example house music
       */
      search?: string
      /**
       * @description Filtrer par tags utilisés dans des mixtapes
       * @example true
       */
      hasUsage?: boolean
    }
    CreateTagDto: {
      /**
       * @description Tag name
       * @example Electronic
       */
      name: string
      /**
       * @description Tag color (hex format)
       * @example #3B82F6
       */
      color?: string
    }
    TagsListResponseDto: {
      /** @description Pagination metadata */
      pagination: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
        hasNext?: boolean
        hasPrev?: boolean
      }
      /** @description Applied filters */
      filters: {
        [key: string]: unknown
      }
      /** @description The list of tags */
      data: components['schemas']['Tag'][]
    }
    TagResponseDto: {
      /** @description The tag data */
      data: components['schemas']['Tag']
    }
    UpdateTagDto: {
      /**
       * @description Tag name
       * @example Electronic
       */
      name?: string
      /**
       * @description Tag color (hex format)
       * @example #3B82F6
       */
      color?: string
    }
    BaseQueryDto: {
      /**
       * @description Numéro de page (commence à 1)
       * @default 1
       * @example 1
       */
      page: number
      /**
       * @description Nombre d'éléments par page
       * @default 10
       * @example 10
       */
      limit: number
      /**
       * @description Champ de tri
       * @example createdAt
       */
      sortBy?: string
      /**
       * @description Ordre de tri
       * @default DESC
       * @example DESC
       * @enum {string}
       */
      sortOrder: 'ASC' | 'DESC'
      /**
       * @description Recherche textuelle globale
       * @example house music
       */
      search?: string
    }
    BaseResponseDto: {
      /** @description Pagination metadata */
      pagination: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
        hasNext?: boolean
        hasPrev?: boolean
      }
      /** @description Applied filters */
      filters: {
        [key: string]: unknown
      }
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>

export interface operations {
  AuthController_signIn: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['SignInDto']
      }
    }
    responses: {
      /** @description Returns user profile and expiry, sets httpOnly cookies */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AuthController_signUp: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['SignUpDto']
      }
    }
    responses: {
      /** @description Returns user profile and expiry, sets httpOnly cookies */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AuthController_refreshTokens: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Returns new tokens in httpOnly cookies */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AuthController_signOut: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successfully logged out */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AuthController_getProfile: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Returns user profile with token expiration */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['User']
        }
      }
    }
  }
  AuthController_forgotPassword: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['ForgotPasswordDto']
      }
    }
    responses: {
      /** @description Password reset email sent if account exists */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AuthController_resetPassword: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['ResetPasswordDto']
      }
    }
    responses: {
      /** @description Password successfully reset */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invalid or expired token */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  UsersController_findAll: {
    parameters: {
      query?: {
        /** @description Numéro de page (commence à 1) */
        page?: number
        /** @description Nombre d'éléments par page */
        limit?: number
        /** @description Champ de tri */
        sortBy?: string
        /** @description Ordre de tri */
        sortOrder?: string
        /** @description Recherche textuelle globale */
        search?: string
        /** @description Filtrer par rôle utilisateur */
        role?: string
        /** @description Filtrer par utilisateurs ayant un profil défini */
        hasProfile?: boolean
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Paginated list of users retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['UsersListResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Forbidden - Insufficient privileges */
      403: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  UsersController_create: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateUserDto']
      }
    }
    responses: {
      /** @description User created successfully */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request - Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Forbidden - Insufficient privileges */
      403: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Conflict - User already exists */
      409: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  UsersController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description User unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description User retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['UserResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Forbidden - Insufficient privileges or accessing another user's profile */
      403: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description User not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  UsersController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description User unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description User deleted successfully */
      204: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Forbidden - Insufficient privileges */
      403: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description User not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  UsersController_update: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description User unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateUserDto']
      }
    }
    responses: {
      /** @description User updated successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request - Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Forbidden - Insufficient privileges */
      403: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description User not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  UsersController_createProfile: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description User unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateUserProfileDto']
      }
    }
    responses: {
      /** @description User profile created successfully */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request - Invalid input data or user already has profile */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Forbidden - Insufficient privileges */
      403: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description User not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  UsersController_updateProfile: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description User unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateUserProfileDto']
      }
    }
    responses: {
      /** @description User profile updated successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request - Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Forbidden - Insufficient privileges */
      403: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description User not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AudioFilesController_findAll: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Audio files retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['AudioFile'][]
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AudioFilesController_upload: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'multipart/form-data': {
          /**
           * Format: binary
           * @description Audio file to upload (MP3, WAV, FLAC, M4A, AAC)
           */
          file?: string
          /**
           * @description Bucket to store the audio file in (optional, defaults to "source")
           * @example source
           */
          bucket?: string
        }
      }
    }
    responses: {
      /** @description Audio file uploaded successfully */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['AudioFile']
        }
      }
      /** @description Bad request - No file or invalid file type */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AudioFilesController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Audio file unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Audio file details retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Audio file not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AudioFilesController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Audio file unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Audio file deleted successfully */
      204: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Audio file not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AudioFilesController_stream: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Audio file unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Audio file streamed successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Audio file not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  AudioFilesController_serveByFullUri: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_upload: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'multipart/form-data': {
          /**
           * Format: binary
           * @description Image file to upload (JPEG, PNG, GIF, WebP)
           */
          file?: string
          /**
           * @description Bucket to store the image in (optional, defaults to "web")
           * @example avatars
           */
          bucket?: string
        }
      }
    }
    responses: {
      /** @description Image uploaded successfully */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ImageFile']
        }
      }
      /** @description Bad request - No file or invalid file type */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_findByBucket: {
    parameters: {
      query: {
        bucket: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Images retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ImageFile'][]
        }
      }
      /** @description Bad Request - Bucket parameter is required */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Image unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Image metadata retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ImageFile']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Image not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_serveImageById: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Image unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Image file served successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Image not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Image unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Image deleted successfully */
      204: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Image not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_serveThumbnailById: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Image unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Thumbnail served successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Thumbnail not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_serveByFullUri: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_serveByUri: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Storage bucket name */
        bucket: string
        /** @description Image filename with UUID */
        filename: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  ImageFilesController_serveThumbnailByUri: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Storage bucket name */
        bucket: string
        /** @description Image filename with UUID */
        filename: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  InvitationsController_sendInvitation: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['SendInvitationDto']
      }
    }
    responses: {
      /** @description Invitation envoyée avec succès */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Email déjà utilisé ou invitation existante */
      409: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  InvitationsController_findAll: {
    parameters: {
      query?: {
        /** @description Numéro de page (commence à 1) */
        page?: number
        /** @description Nombre d'éléments par page */
        limit?: number
        /** @description Champ de tri */
        sortBy?: string
        /** @description Ordre de tri */
        sortOrder?: string
        /** @description Recherche textuelle globale */
        search?: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Liste paginée des invitations */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['InvitationsListResponseDto']
        }
      }
    }
  }
  InvitationsController_validateToken: {
    parameters: {
      query: {
        token: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Token validé */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Token invalide */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  InvitationsController_cancelInvitation: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Invitation annulée */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invitation non trouvée */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  HealthController_healthCheck: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description API is healthy */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            /** @example ok */
            status?: string
            /** @example 2025-07-06T12:00:00.000Z */
            timestamp?: string
            /** @example 3600 */
            uptime?: number
            /** @example production */
            environment?: string
            /** @example 1.0.0 */
            version?: string
          }
        }
      }
    }
  }
  StreamController_debugListeners: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Current listeners debug information */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            /** @description Current listeners count */
            current?: number
            /** @description Whether there are active observers */
            hasObservers?: boolean
            /** @description Number of active observers */
            observersCount?: number
          }
        }
      }
    }
  }
  StreamController_debugProgress: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Current progress debug information */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            /** @description Current track progress percentage */
            current?: number
            /** @description Whether there are active observers */
            hasObservers?: boolean
            /** @description Number of active observers */
            observersCount?: number
          }
        }
      }
    }
  }
  StreamController_debugEvents: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Current events debug information */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            /** @description Current events data */
            current?: {
              /** @description IceCast data */
              icecast?: Record<string, never>
              /** @description AirTime data */
              airtime?: Record<string, never>
            }
            /** @description Whether there are active observers */
            hasObservers?: boolean
            /** @description Number of active observers */
            observersCount?: number
          }
        }
      }
    }
  }
  StreamController_debugAll: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Complete debug information for all streams */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            listeners?: {
              current?: number
              hasObservers?: boolean
              observersCount?: number
            }
            progress?: {
              current?: number
              hasObservers?: boolean
              observersCount?: number
            }
            events?: {
              current?: Record<string, never>
              hasObservers?: boolean
              observersCount?: number
            }
          }
        }
      }
    }
  }
  StreamController_events: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Stream events data */
      200: {
        headers: {
          /** @description text/event-stream */
          'Content-Type'?: unknown
          /** @description keep-alive */
          Connection?: unknown
          /** @description no-cache */
          'Cache-Control'?: unknown
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['EventsResponseDto']
        }
      }
    }
  }
  StreamController_listeners: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Current listeners count */
      200: {
        headers: {
          /** @description text/event-stream */
          'Content-Type'?: unknown
          /** @description keep-alive */
          Connection?: unknown
          /** @description no-cache */
          'Cache-Control'?: unknown
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ListenersResponseDto']
        }
      }
    }
  }
  StreamController_progress: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Current track progress percentage */
      200: {
        headers: {
          /** @description text/event-stream */
          'Content-Type'?: unknown
          /** @description keep-alive */
          Connection?: unknown
          /** @description no-cache */
          'Cache-Control'?: unknown
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ProgressResponseDto']
        }
      }
    }
  }
  StreamController_metadata: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Enriched metadata (mixtape or standalone track) */
      200: {
        headers: {
          /** @description text/event-stream */
          'Content-Type'?: unknown
          /** @description keep-alive */
          Connection?: unknown
          /** @description no-cache */
          'Cache-Control'?: unknown
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['MetadataStreamDto']
        }
      }
    }
  }
  StreamController_activity: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Activity data (progress and listeners) */
      200: {
        headers: {
          /** @description text/event-stream */
          'Content-Type'?: unknown
          /** @description keep-alive */
          Connection?: unknown
          /** @description no-cache */
          'Cache-Control'?: unknown
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['ActivityStreamDto']
        }
      }
    }
  }
  MixtapesController_findAll: {
    parameters: {
      query?: {
        /** @description Numéro de page (commence à 1) */
        page?: number
        /** @description Nombre d'éléments par page */
        limit?: number
        /** @description Champ de tri */
        sortBy?: string
        /** @description Ordre de tri */
        sortOrder?: string
        /** @description Recherche textuelle globale */
        search?: string
        /** @description Filtrer par tags (noms) */
        tags?: string[]
        /** @description Filtrer par DJs (noms ou slugs) */
        djs?: string[]
        /** @description Filtrer par année exacte */
        year?: number
        /** @description Filtrer par année minimum */
        yearFrom?: number
        /** @description Filtrer par année maximum */
        yearTo?: number
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Paginated list of mixtapes retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['MixtapesListResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_create: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateMixtapeDto']
      }
    }
    responses: {
      /** @description Mixtape created successfully with associated tags */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request - Invalid input data or cover image not found */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_getAvailableYears: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description List of available years retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            /** @example [
             *       2024,
             *       2023,
             *       2022,
             *       2021
             *     ] */
            data?: number[]
          }
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Mixtape retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['MixtapeResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Mixtape deleted successfully */
      204: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_update: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateMixtapeDto']
      }
    }
    responses: {
      /** @description Mixtape updated successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request - Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_updateCover: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
        /** @description Image unique identifier */
        imageId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Cover updated successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape or image not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_removeCover: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Cover removed and image deleted successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_getMixtapeTags: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Mixtape tags retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_addTagsToMixtape: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['AddTagsToMixtapeDto']
      }
    }
    responses: {
      /** @description Tags added to mixtape successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Bad request - Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_removeTagFromMixtape: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape unique identifier */
        id: string
        /** @description Tag unique identifier */
        tagId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Tag removed from mixtape successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape or tag not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_getMixtapeDjs: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape ID */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Mixtape DJs retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_addDjsToMixtape: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape ID */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['AddDjsToMixtapeDto']
      }
    }
    responses: {
      /** @description DJs added to mixtape successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixtapesController_removeDjFromMixtape: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Mixtape ID */
        id: string
        /** @description DJ ID to remove */
        djId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description DJ removed from mixtape successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Mixtape not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  DjsController_findAll: {
    parameters: {
      query?: {
        /** @description Numéro de page (commence à 1) */
        page?: number
        /** @description Nombre d'éléments par page */
        limit?: number
        /** @description Champ de tri */
        sortBy?: string
        /** @description Ordre de tri */
        sortOrder?: string
        /** @description Recherche textuelle globale */
        search?: string
        /** @description Filtrer par DJs ayant des mixtapes */
        hasMixtapes?: boolean
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Paginated list of DJs retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['DjsListResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  DjsController_create: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateDjDto']
      }
    }
    responses: {
      /** @description DJ created successfully */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  DjsController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description DJ unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description DJ retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['DjResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description DJ not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  DjsController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description DJ unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description DJ deleted successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description DJ not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  DjsController_update: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description DJ unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateDjDto']
      }
    }
    responses: {
      /** @description DJ updated successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description DJ not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  DjsController_getDjMixtapes: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description DJ unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description DJ mixtapes retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description DJ not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TracksController_findAll: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Session UUID */
        sessionId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Tracks retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['SessionTrack'][]
        }
      }
    }
  }
  TracksController_upload: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Session UUID */
        sessionId: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'multipart/form-data': {
          /**
           * Format: binary
           * @description Audio file to upload (MP3, WAV, FLAC, M4A, AAC)
           */
          file?: string
          /**
           * @description Track order in timeline (optional, defaults to end of list)
           * @example 0
           */
          trackOrder?: number
        }
      }
    }
    responses: {
      /** @description Track uploaded successfully */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['SessionTrack']
        }
      }
      /** @description Bad request - No file or invalid file type */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TracksController_reorder: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Session UUID */
        sessionId: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['ReorderTracksDto']
      }
    }
    responses: {
      /** @description Tracks reordered successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['SessionTrack'][]
        }
      }
    }
  }
  TracksController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Track UUID */
        id: string
        /** @description Session UUID */
        sessionId: unknown
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Track details retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['SessionTrack']
        }
      }
    }
  }
  TracksController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Track UUID */
        id: string
        /** @description Session UUID */
        sessionId: unknown
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Track deleted successfully */
      204: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TracksController_stream: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Track UUID */
        id: string
        /** @description Session UUID */
        sessionId: unknown
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Track audio streamed successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixSessionsController_findAll: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Liste des sessions */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['MixSession'][]
        }
      }
    }
  }
  MixSessionsController_create: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateMixSessionDto']
      }
    }
    responses: {
      /** @description Session créée avec succès */
      201: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['MixSession']
        }
      }
    }
  }
  MixSessionsController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Session trouvée */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['MixSession']
        }
      }
      /** @description Session non trouvée */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixSessionsController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Session supprimée */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Session non trouvée */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixSessionsController_update: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateMixSessionDto']
      }
    }
    responses: {
      /** @description Session mise à jour */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['MixSession']
        }
      }
      /** @description Session non trouvée */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixSessionsController_export: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Export démarré avec succès */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': {
            success?: boolean
            exportId?: string
            filename?: string
            durationSeconds?: number
            fileSizeBytes?: number
            downloadUrl?: string
          }
        }
      }
      /** @description Session non trouvée */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  MixSessionsController_download: {
    parameters: {
      query?: never
      header?: never
      path: {
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Fichier téléchargé */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'audio/mpeg': unknown
        }
      }
      /** @description Export non trouvé */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TagsController_findAll: {
    parameters: {
      query?: {
        /** @description Numéro de page (commence à 1) */
        page?: number
        /** @description Nombre d'éléments par page */
        limit?: number
        /** @description Champ de tri */
        sortBy?: string
        /** @description Ordre de tri */
        sortOrder?: string
        /** @description Recherche textuelle globale */
        search?: string
        /** @description Filtrer par tags utilisés dans des mixtapes */
        hasUsage?: boolean
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Paginated list of tags retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['TagsListResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TagsController_create: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['CreateTagDto']
      }
    }
    responses: {
      /** @description Tag created successfully */
      201: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TagsController_findOne: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Tag unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Tag retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/json': components['schemas']['TagResponseDto']
        }
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Tag not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TagsController_remove: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Tag unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Tag deleted successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Tag not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TagsController_update: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Tag unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateTagDto']
      }
    }
    responses: {
      /** @description Tag updated successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Invalid input data */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Tag not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  TagsController_getTagMixtapes: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description Tag unique identifier */
        id: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Tag mixtapes retrieved successfully */
      200: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Unauthorized - Invalid or missing token */
      401: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Tag not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}
