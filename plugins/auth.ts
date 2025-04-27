import type { User } from '@prisma/client'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) {
    return {}
  }

  const { data: session, refresh: updateSession } = await useFetch<User>('/api/auth/session')

  const isLoggedIn = computed(() => !!session.value?.email)

  // Create a ref to know where to redirect the user when logged in
  const redirectTo = useState('authRedirect')

  /**
   * Add global route middleware to protect pages using:
   * Pages are protected by default
   *
   * definePageMeta({
   *  auth: false
   * })
   */
  const defaultAuthMeta = useRuntimeConfig().auth?.defaultProtected ?? true

  addRouteMiddleware(
    'auth',
    (to) => {
      const authMeta = to.meta?.auth ?? defaultAuthMeta
      if (authMeta && !isLoggedIn.value) {
        redirectTo.value = to.path
        return '/login'
      }
    },
    { global: true },
  )

  const currentRoute = useRoute()
  const currentRouteAuthMeta = currentRoute.meta?.auth ?? defaultAuthMeta

  if (import.meta.client) {
    watch(isLoggedIn, async (loggedIn) => {
      if (!loggedIn && currentRouteAuthMeta) {
        redirectTo.value = currentRoute.path
        await navigateTo('/login')
      }
    })
  }

  if (isLoggedIn.value && currentRoute.path === '/login') {
    await navigateTo(redirectTo.value || '/')
  }

  return {
    provide: {
      auth: {
        isLoggedIn,
        session,
        redirectTo,
        updateSession,
      },
    },
  }
})
