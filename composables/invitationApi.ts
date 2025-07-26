import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type {
  CreateInvitationDto,
  InvitationQueryParams,
  InvitationResponse,
  PaginatedInvitationsResponse,
  ValidationTokenResponse,
} from '../types/invitation'
import { HttpMethod, useApi } from './api'
import { queryKeys } from './query-keys'

// Types pour les paramètres des fonctions
interface SendInvitationParams {
  email: string
  message?: string
}

interface ValidateTokenParams {
  token: string
}

/**
 * Composable pour gérer les invitations
 * Intégration complète avec le système d'invitations de l'API Nina.fm
 */
export const useInvitationApi = () => {
  const { call } = useApi()
  const queryClient = useQueryClient()

  /**
   * Envoyer une nouvelle invitation
   * Nécessite le rôle ADMIN
   */
  const sendInvitation = useMutation({
    mutationFn: async ({ email, message }: SendInvitationParams): Promise<InvitationResponse> => {
      const payload: CreateInvitationDto = {
        email,
        message: message || undefined,
      }

      return call<InvitationResponse>('/invitations/send', {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      })
    },
    onSuccess: () => {
      // Invalider le cache des invitations pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.list() })
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi de l'invitation:", error)
    },
  })

  /**
   * Récupérer la liste des invitations (pagination supportée)
   * Nécessite le rôle ADMIN
   */
  const getInvitations = (params: InvitationQueryParams | ComputedRef<InvitationQueryParams> = {}) => {
    return useQuery({
      queryKey: computed(() => {
        const resolvedParams = unref(params)
        return queryKeys.invitations.list(resolvedParams)
      }),
      queryFn: async (): Promise<PaginatedInvitationsResponse> => {
        const resolvedParams = unref(params)
        const searchParams = new URLSearchParams()

        if (resolvedParams.page) searchParams.append('page', resolvedParams.page.toString())
        if (resolvedParams.limit) searchParams.append('limit', resolvedParams.limit.toString())
        if (resolvedParams.status) searchParams.append('status', resolvedParams.status)
        if (resolvedParams.search) searchParams.append('search', resolvedParams.search)

        const queryString = searchParams.toString()
        const endpoint = queryString ? `/invitations?${queryString}` : '/invitations'

        return call<PaginatedInvitationsResponse>(endpoint, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (anciennement cacheTime)
    })
  }

  /**
   * Valider un token d'invitation
   * Endpoint public - pas besoin d'authentification
   */
  const validateInvitationToken = useMutation({
    mutationFn: async ({ token }: ValidateTokenParams): Promise<ValidationTokenResponse> => {
      return call<ValidationTokenResponse>(`/invitations/validate?token=${encodeURIComponent(token)}`, {
        method: HttpMethod.GET,
        requireAuth: false,
      })
    },
    onError: (error) => {
      console.error('Erreur lors de la validation du token:', error)
    },
  })

  /**
   * Annuler/Supprimer une invitation
   * Nécessite le rôle ADMIN
   */
  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string): Promise<{ success: boolean }> => {
      return call<{ success: boolean }>(`/invitations/${invitationId}`, {
        method: HttpMethod.DELETE,
        requireAuth: true,
      })
    },
    onSuccess: () => {
      // Invalider le cache des invitations
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.list() })
    },
    onError: (error) => {
      console.error("Erreur lors de l'annulation de l'invitation:", error)
    },
  })

  /**
   * Renvoyer une invitation (créer un nouveau token)
   * Fonctionnalité helper qui combine cancel + send
   */
  const resendInvitation = useMutation({
    mutationFn: async ({ invitationId, email, message }: { invitationId: string; email: string; message?: string }) => {
      // D'abord annuler l'ancienne invitation
      await cancelInvitation.mutateAsync(invitationId)
      // Puis envoyer une nouvelle invitation
      return sendInvitation.mutateAsync({ email, message })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.list() })
    },
  })

  /**
   * Utility: Vérifier si l'utilisateur actuel peut gérer les invitations
   */
  const canManageInvitations = computed(() => {
    const authStore = useAuthStore()
    return authStore.userRole === 'ADMIN'
  })

  /**
   * Utility: Formater le statut d'une invitation pour l'affichage
   */
  const getInvitationStatusLabel = (invitation: InvitationResponse): string => {
    if (invitation.used_at) {
      return 'Utilisée'
    }

    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)

    if (now > expiresAt) {
      return 'Expirée'
    }

    return 'En attente'
  }

  /**
   * Utility: Obtenir la couleur CSS pour le statut
   */
  const getInvitationStatusColor = (invitation: InvitationResponse): string => {
    const status = getInvitationStatusLabel(invitation)

    switch (status) {
      case 'Utilisée':
        return 'text-green-600 bg-green-100'
      case 'Expirée':
        return 'text-red-600 bg-red-100'
      case 'En attente':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return {
    // Mutations
    sendInvitation,
    validateInvitationToken,
    cancelInvitation,
    resendInvitation,

    // Queries
    getInvitations,

    // Utilities
    canManageInvitations,
    getInvitationStatusLabel,
    getInvitationStatusColor,
  }
}

/**
 * Composable spécialisé pour la validation de token sur la page register
 */
export const useInvitationValidation = () => {
  const route = useRoute()
  const { validateInvitationToken } = useInvitationApi()

  // Récupérer le token depuis l'URL (query parameter)
  const invitationToken = computed(() => {
    return (route.query.token as string) || null
  })

  // Valider automatiquement le token s'il est présent
  const tokenValidation = computed(() => {
    if (!invitationToken.value) {
      return null
    }

    return validateInvitationToken
  })

  return {
    invitationToken,
    tokenValidation,
    hasInvitationToken: computed(() => !!invitationToken.value),
  }
}
