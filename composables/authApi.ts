import type { User } from '~/types/db'

export type UserEdit = Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>

export const useAuth = () => {
  const { hasRole, hasAnyRole, isLoggedIn, redirectTo, session, updateSession } = useNuxtApp().$auth
  const { getUserById } = useUserApi()

  const user = ref<User | null>(null)

  onMounted(() => {
    updateUser()
  })

  const updateUser = async () => {
    user.value = await getUserById(session.value.id)
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

  const login = async (email: string, password: string) => {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email,
        password: password,
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
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    // Methods
    hasRole,
    hasAnyRole,
    login,
    register,
    logout,
  }
}
