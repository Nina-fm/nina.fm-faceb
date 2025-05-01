import type { SessionData } from 'h3'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) {
    return {}
  }

  const { data, refresh: updateSession } = await useFetch('/api/auth/session')

  const session = data as SessionData
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
  const defaultAuthMeta = useRuntimeConfig().app.auth?.defaultProtected ?? true

  addRouteMiddleware(
    'auth',
    (to) => {
      const toRequireAuth = to.meta?.auth ?? defaultAuthMeta
      if (!isLoggedIn.value && toRequireAuth) {
        redirectTo.value = to.path
        return '/login'
      }
    },
    { global: true },
  )

  const currentRoute = useRoute()
  const currentRouteRequireAuth = currentRoute.meta?.auth ?? defaultAuthMeta

  if (import.meta.client) {
    watch(isLoggedIn, async (loggedIn) => {
      if (!loggedIn && currentRouteRequireAuth) {
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
