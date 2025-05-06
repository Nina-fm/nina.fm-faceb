export const useInvitationApi = () => {
  const fetchInvitations = async (params?: { page: number; limit: number }) => {
    return await $fetch('/api/invitations', {
      method: 'GET',
      params,
    })
  }

  const getInvitationById = async (id: string | number) => {
    return await $fetch('/api/invitation', {
      method: 'GET',
      params: {
        id,
      },
    })
  }

  const getInvitationByToken = async (token: string) => {
    return await $fetch('/api/invitation', {
      method: 'GET',
      params: {
        token,
      },
    })
  }

  const createInvitation = async (email: string) => {
    const baseUrl = window.origin
    await $fetch('/api/invitation', {
      method: 'POST',
      body: {
        email,
        baseUrl,
      },
    })
  }

  const resendInvitation = async (id: string | number) => {
    console.log('resend invitaiton', id)
    const baseUrl = window.origin
    const response = await $fetch('/api/invitation/resend', {
      method: 'POST',
      body: {
        id,
        baseUrl,
      },
    })

    return response
  }

  const deleteInvitation = async (id: string | number) => {
    await $fetch('/api/invitation', {
      method: 'DELETE',
      params: {
        id,
      },
    })
  }

  return {
    createInvitation,
    deleteInvitation,
    fetchInvitations,
    getInvitationById,
    getInvitationByToken,
    resendInvitation,
  }
}
