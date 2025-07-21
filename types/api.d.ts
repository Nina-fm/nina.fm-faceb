// API Types for Nina.fm API Integration

declare global {
  type AsyncFunc<T extends any[], U> = (...args: T) => Promise<U>

  // Generic API Response Types
  interface ApiError {
    message: string
    error?: string
    statusCode?: number
  }

  interface ApiSuccessResponse<T = any> {
    data: T
    message?: string
  }

  interface ApiErrorResponse {
    error: ApiError
    data: null
  }

  type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

  // Pagination
  interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  interface PaginatedResponse<T = any> {
    data: T[]
    meta: PaginationMeta
  }

  // Authentication Types
  interface SignUpParams {
    email: string
    password: string
  }

  interface SignInParams {
    email: string
    password: string
  }

  interface AuthTokens {
    accessToken: string
    refreshToken: string
  }

  interface RefreshTokenParams {
    refreshToken: string
  }

  // User & Profile Types
  enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    CONTRIBUTOR = 'CONTRIBUTOR',
    VIEWER = 'VIEWER',
  }

  interface Image {
    id: string
    originalName: string
    filename: string
    mimeType: string
    size: number
    path: string
    url: string
    createdAt: string
    updatedAt: string
  }

  interface Profile {
    id: string
    nickname: string
    description?: string
    avatar?: Image
    createdAt: string
    updatedAt: string
  }

  interface User {
    id: string
    email: string
    role: Role
    profile: Profile
    createdAt: string
    updatedAt: string
  }

  interface CurrentUser extends User {
    permissions?: string[]
  }

  // DJ Types
  interface Dj {
    id: string
    name: string
    description?: string
    website?: string
    facebook?: string
    instagram?: string
    soundcloud?: string
    avatar?: Image
    createdAt: string
    updatedAt: string
    createdBy?: User
  }

  // Tag Types
  interface Tag {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string
    createdBy?: User
  }

  // Mixtape Types
  interface Track {
    title: string
    artist?: string
    duration?: string
    [key: string]: any
  }

  interface Mixtape {
    id: string
    name: string
    year: number
    tracksAsText?: string
    tracks?: Track[]
    description?: string
    comment?: string
    cover?: Image
    djs: Dj[]
    tags: Tag[]
    createdAt: string
    updatedAt: string
    createdBy?: User
  }

  // DTOs for Create/Update operations
  interface CreateUserDto {
    email: string
    password: string
    role?: Role
  }

  interface UpdateUserDto {
    email?: string
    role?: Role
  }

  interface CreateProfileDto {
    nickname: string
    description?: string
  }

  interface UpdateProfileDto {
    nickname?: string
    description?: string
  }

  interface CreateDjDto {
    name: string
    description?: string
    website?: string
    facebook?: string
    instagram?: string
    soundcloud?: string
  }

  interface UpdateDjDto {
    name?: string
    description?: string
    website?: string
    facebook?: string
    instagram?: string
    soundcloud?: string
  }

  interface CreateTagDto {
    name: string
    description?: string
  }

  interface UpdateTagDto {
    name?: string
    description?: string
  }

  interface CreateMixtapeDto {
    name: string
    year: number
    tracksAsText?: string
    tracks?: Track[]
    description?: string
    comment?: string
    djIds: string[]
    tagIds: string[]
  }

  interface UpdateMixtapeDto {
    name?: string
    year?: number
    tracksAsText?: string
    tracks?: Track[]
    description?: string
    comment?: string
    djIds?: string[]
    tagIds?: string[]
  }

  // Query Parameters for API endpoints
  interface UserQueryParams {
    page?: number
    limit?: number
    search?: string
    role?: Role
  }

  interface DjQueryParams {
    page?: number
    limit?: number
    search?: string
  }

  interface TagQueryParams {
    page?: number
    limit?: number
    search?: string
  }

  interface MixtapeQueryParams {
    page?: number
    limit?: number
    search?: string
    year?: number
    djId?: string
    tagId?: string
  }

  // File Upload Types
  interface FileUploadResponse {
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
  }
}

export {}
