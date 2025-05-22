export const useAuthApi = () => {
  const { hasRole, hasAnyRole, isLoggedIn, redirectTo, session, updateSession } = useNuxtApp().$auth
  const { getImagePublicUrl } = useImageApi()

  const user = computed(() => ({
    ...session.value,
    avatar: session.value?.avatar
      ? {
          ...session.value.avatar,
          url: getImagePublicUrl(session.value.avatar.filename, session.value.avatar.bucket || ''),
          alt: session.value.name ?? '',
        }
      : undefined,
  }))

  const currentUserId = computed(() => session.value?.id)

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

  const login = async (email: string, password: string) => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email,
        password,
      },
    })
    redirectTo.value = null
    await updateSession()
    await navigateTo(redirectTo.value || '/')
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
    await updateSession()
  }

  return {
    // State
    currentUserId,
    user,
    isLoggedIn,
    // Actions
    hasRole,
    hasAnyRole,
    login,
    logout,
    refreshSession: updateSession,
    register,
  }
}
