/**
 * Types temporaires pour les invitations
 * À remplacer par les types générés depuis l'API quand disponibles
 */

export interface CreateInvitationDto {
  email: string
  message?: string
}

export interface InvitationResponse {
  id: string
  email: string
  message?: string
  token: string
  used_at?: string | null
  expires_at: string
  invited_by: {
    id: string
    email: string
  }
  created_at: string
  updated_at: string
}

export interface PaginatedInvitationsResponse {
  data: InvitationResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ValidationTokenResponse {
  valid: boolean
  email?: string
  message?: string
  expires_at?: string
  invited_by?: {
    id: string
    email: string
  }
}

export interface InvitationQueryParams {
  page?: number
  limit?: number
  status?: 'pending' | 'used' | 'expired'
  search?: string
}
