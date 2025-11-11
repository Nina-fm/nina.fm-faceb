import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { components } from '~/types/api/globals.types'
import { HttpMethod, useApi } from './api'
import { buildEndpoint, createErrorHandler, getListQueryConfig } from './apiHelpers'
import { queryKeys } from './query-keys'

type SendInvitationDto = components['schemas']['SendInvitationDto']
type Invitation = components['schemas']['Invitation']
type InvitationsQueryDto = components['schemas']['InvitationsQueryDto']
type InvitationsListResponseDto = components['schemas']['InvitationsListResponseDto']
type ValidateInvitationTokenResponseDto = components['schemas']['ValidateInvitationTokenResponseDto']

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
    mutationFn: async (payload: SendInvitationDto): Promise<Invitation> => {
      return call<Invitation>('/invitations/send', {
        method: HttpMethod.POST,
        body: payload,
        requireAuth: true,
      })
    },
    onSuccess: () => {
      // Invalider le cache des invitations pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() })
    },
    onError: createErrorHandler("l'envoi de l'invitation"),
  })

  /**
   * Récupérer la liste des invitations (pagination supportée)
   * Nécessite le rôle ADMIN
   */
  const getInvitations = (params: Partial<InvitationsQueryDto> | ComputedRef<Partial<InvitationsQueryDto>> = {}) => {
    return useQuery({
      queryKey: computed(() => {
        const resolvedParams = unref(params)
        return queryKeys.invitations.list(resolvedParams)
      }),
      queryFn: async (): Promise<InvitationsListResponseDto> => {
        const resolvedParams = unref(params)
        const endpoint = buildEndpoint('/invitations', resolvedParams)

        return call<InvitationsListResponseDto>(endpoint, {
          method: HttpMethod.GET,
          requireAuth: true,
        })
      },
      ...getListQueryConfig(),
    })
  }

  /**
   * Valider un token d'invitation
   * Endpoint public - pas besoin d'authentification
   */
  const validateInvitationToken = useMutation({
    mutationFn: async ({ token }: ValidateTokenParams): Promise<ValidateInvitationTokenResponseDto> => {
      return call<ValidateInvitationTokenResponseDto>(`/invitations/validate?token=${encodeURIComponent(token)}`, {
        method: HttpMethod.GET,
        requireAuth: false,
      })
    },
    onError: createErrorHandler('la validation du token'),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() })
    },
    onError: createErrorHandler("l'annulation de l'invitation"),
  })

  /**
   * Renvoyer une invitation (créer un nouveau token)
   * Fonctionnalité helper qui combine cancel + send
   */
  const resendInvitation = useMutation({
    mutationFn: async ({ invitationId, email, message }: { invitationId: string; email: string; message?: string }) => {
      await cancelInvitation.mutateAsync(invitationId)
      return sendInvitation.mutateAsync({ email, message })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations.lists() })
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
  const getInvitationStatusLabel = (invitation: Invitation): string => {
    if (invitation.usedAt) {
      return 'Utilisée'
    }

    const now = new Date()
    const expiresAt = new Date(invitation.expiresAt)

    if (now > expiresAt) {
      return 'Expirée'
    }

    return 'En attente'
  }

  /**
   * Utility: Obtenir la couleur CSS pour le statut
   */
  const getInvitationStatusColor = (invitation: Invitation): string => {
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
