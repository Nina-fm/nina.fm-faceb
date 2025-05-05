import type { Role } from '@prisma/client'
import type { SessionData } from 'h3'

export default defineNuxtPlugin(async (nuxtApp) => {
  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) {
    return {}
  }

  const { data, refresh: updateSession } = await useFetch('/api/auth/session')

  const session = data as SessionData
  const isLoggedIn = computed(() => !!session.value.email)

  const hasRole = (role: Role) => {
    if (!session.value) {
      return false
    }
    const userRoles = session.value.roles || []
    return userRoles.includes(role)
  }

  const hasAnyRole = (roles: Role[]) => {
    if (!session.value.roles?.length) {
      return false
    }
    const userRoles = session.value.roles || []
    return roles.some((role) => userRoles.includes(role))
  }

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
  const defaultRolesMeta = useRuntimeConfig().app.roles?.defaultRolesRequired ?? false

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

  addRouteMiddleware(
    'roles',
    (to) => {
      const toRequireRoles = to.meta?.roles ?? defaultRolesMeta
      if (Array.isArray(toRequireRoles) && !hasAnyRole(toRequireRoles)) {
        throw createError({ statusCode: 403 })
      }
    },
    { global: true },
  )

  const currentRoute = useRoute()
  const currentRouteRequireAuth = currentRoute.meta?.auth ?? defaultAuthMeta
  const currentRouteRequireRoles = currentRoute.meta?.roles ?? defaultRolesMeta

  if (import.meta.client) {
    watch(isLoggedIn, async (loggedIn) => {
      if (!loggedIn && currentRouteRequireAuth) {
        redirectTo.value = currentRoute.path
        await navigateTo('/login')
      }
    })
    watch(
      () => hasAnyRole(currentRouteRequireRoles || []),
      async (hasRole) => {
        if (!hasRole && currentRouteRequireRoles) {
          throw createError({ statusCode: 403 })
        }
      },
    )
  }

  if (isLoggedIn.value && currentRoute.path === '/login') {
    await navigateTo(redirectTo.value || '/')
  }

  return {
    provide: {
      auth: {
        hasRole,
        hasAnyRole,
        isLoggedIn,
        redirectTo,
        session,
        updateSession,
      },
    },
  }
})
