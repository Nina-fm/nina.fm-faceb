export const useInvitationApi = () => {
  const { pending, defineAction, defineDelayedAction } = useAction()

  const fetchInvitations = async (params?: { page: number; limit: number }) =>
    defineAction(async () => {
      return await $fetch('/api/invitations', {
        method: 'GET',
        params,
      })
    })

  const getInvitationById = async (id: string | number) =>
    defineAction(async () => {
      return await $fetch('/api/invitation', {
        method: 'GET',
        params: {
          id,
        },
      })
    })

  const getInvitationByToken = async (token: string) =>
    defineAction(async () => {
      return await $fetch('/api/invitation', {
        method: 'GET',
        params: {
          token,
        },
      })
    })

  const createInvitation = async (email: string) =>
    defineDelayedAction(async () => {
      const baseUrl = window.origin
      await $fetch('/api/invitation', {
        method: 'POST',
        body: {
          email,
          baseUrl,
        },
      })
    })

  const resendInvitation = async (id: string | number) =>
    defineDelayedAction(async () => {
      const baseUrl = window.origin
      const response = await $fetch('/api/invitation/resend', {
        method: 'POST',
        body: {
          id,
          baseUrl,
        },
      })

      return response
    })

  const deleteInvitation = async (id: string | number) =>
    defineDelayedAction(async () => {
      await $fetch('/api/invitation', {
        method: 'DELETE',
        params: {
          id,
        },
      })
    })

  return {
    // State
    pending,
    // Actions
    createInvitation,
    deleteInvitation,
    fetchInvitations,
    getInvitationById,
    getInvitationByToken,
    resendInvitation,
  }
}
