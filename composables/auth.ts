export const useAuth = () => {
  const auth = useNuxtApp().$auth
  const isLoggedIn = computed(() => !!auth.isLoggedIn.value)
  const user = computed(() => auth.session.value)

  const login = async (email: string, password: string) => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email,
        password: password,
      },
    })
    auth.redirectTo.value = null
    await auth.updateSession()
    await navigateTo(auth.redirectTo.value || '/')
  }

  const register = async ({
    email,
    name,
    password,
    invitationToken,
  }: {
    email: string
    password: string
    name?: string
    invitationToken?: string
  }) => {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email,
        name,
        password,
        invitationToken,
      },
    })
    return await login(email, password)
  }

  const invite = async (email: string) => {
    const baseUrl = window.origin
    await $fetch('/api/auth/invite', {
      method: 'POST',
      body: {
        email,
        baseUrl,
      },
    })
  }

  const resendInvitation = async (id: string | number) => {
    const baseUrl = window.origin
    const response = await $fetch('/api/auth/invite-resend', {
      method: 'POST',
      body: {
        id,
        baseUrl,
      },
    })

    return response
  }

  const fetchInvitations = async (params?: { page: number; limit: number }) => {
    const result = await $fetch('/api/auth/invitations', {
      method: 'GET',
      params,
    })

    return {
      ...result,
      invitations: result.invitations.map((invitation: any) => ({
        ...invitation,
        createdAt: new Date(invitation.createdAt),
        updatedAt: new Date(invitation.updatedAt),
      })),
    }
  }

  const getInvitationById = async (id: string | number) => {
    return await $fetch('/api/auth/invitation', {
      method: 'GET',
      params: {
        id,
      },
    })
  }

  const getInvitationByToken = async (token: string) => {
    return await $fetch('/api/auth/invitation', {
      method: 'GET',
      params: {
        token,
      },
    })
  }

  const deleteInvitation = async (id: string | number) => {
    await $fetch('/api/auth/invitation', {
      method: 'DELETE',
      params: {
        id,
      },
    })
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
    await auth.updateSession()
  }

  return {
    user,
    isLoggedIn,
    login,
    register,
    invite,
    resendInvitation,
    fetchInvitations,
    getInvitationById,
    getInvitationByToken,
    deleteInvitation,
    logout,
  }
}
