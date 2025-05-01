import type { Role } from '@prisma/client'
import type { SessionData } from 'h3'
import type { User } from '~/types/db'

export type UserEdit = Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>

export const useAuth = () => {
  const auth = useNuxtApp().$auth
  const { getUserById } = useUserApi()

  const isLoggedIn = computed(() => !!auth.isLoggedIn.value)
  const session = computed<SessionData>(() => auth.session.value)
  const user = ref<User | null>(null)

  onMounted(() => {
    updateUser()
  })

  const updateUser = async () => {
    user.value = await getUserById(session.value.id)
  }

  const hasRole = (role: Role) => {
    if (!user.value) {
      return false
    }
    const userRoles = user.value.roles || []
    return userRoles.includes(role)
  }

  const hasAnyRole = (roles: Role[]) => {
    if (!user.value) {
      return false
    }
    const userRoles = user.value.roles || []
    return roles.some((role) => userRoles.includes(role))
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
    auth.redirectTo.value = null
    await auth.updateSession()
    await navigateTo(auth.redirectTo.value || '/')
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
    await auth.updateSession()
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
