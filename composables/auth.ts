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

  const register = async (email: string, password: string) => {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: email,
        password: password,
      },
    })
    return await login(email, password)
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
    logout,
  }
}
