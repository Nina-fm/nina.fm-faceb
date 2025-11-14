// Les types sont maintenant globaux grâce à api.d.ts

export default defineNuxtPlugin(async (nuxtApp) => {
  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) {
    return {}
  }

  const authStore = useAuthStore()

  // Flag pour savoir si l'initialisation est terminée
  const authInitialized = ref(false)

  // Initialize auth store on plugin load and wait for completion
  await authStore.loadUserProfile()
  authInitialized.value = true

  const isLoggedIn = computed(() => authStore.isLoggedIn)

  const hasRole = (role: string) => {
    if (!authStore.user) {
      return false
    }
    return authStore.user.role === role
  }

  const hasAnyRole = (roles: string[]) => {
    if (!authStore.user?.role) {
      return false
    }
    return roles.includes(authStore.user.role)
  }

  // Create a ref to know where to redirect the user when logged in
  const redirectTo = useState('authRedirect')

  /**
   * Add global route middleware to protect pages using:
   * Pages are NOT protected by default, add auth: true to protect them
   *
   * definePageMeta({
   *  auth: true
   * })
   */
  // Changer la logique : pages NON protégées par défaut
  const defaultAuthMeta = false // Pages NON protégées par défaut
  const defaultRolesMeta = false // Pas de rôles requis par défaut

  addRouteMiddleware(
    'auth',
    (to) => {
      console.log(
        '[AUTH] Middleware - route:',
        to.path,
        'isLoggedIn:',
        isLoggedIn.value,
        'requireAuth:',
        to.meta?.auth ?? defaultAuthMeta,
        'authInitialized:',
        authInitialized.value,
      )

      const toRequireAuth = to.meta?.auth ?? defaultAuthMeta

      // Si l'auth n'est pas encore initialisée et que la page nécessite une auth,
      // on attend l'initialisation avant de rediriger
      if (!authInitialized.value && toRequireAuth) {
        // Attendre l'initialisation côté client
        if (import.meta.client) {
          // Ne pas rediriger immédiatement, l'auth est en cours d'initialisation
          return
        }
      }

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
    // Vérifier si l'utilisateur doit être redirigé une fois l'auth initialisée
    watch(
      authInitialized,
      async (initialized) => {
        if (initialized) {
          const currentRouteRequireAuth = currentRoute.meta?.auth ?? defaultAuthMeta
          console.log(
            '[AUTH] Auth initialized, checking current route:',
            currentRoute.path,
            'requireAuth:',
            currentRouteRequireAuth,
            'isLoggedIn:',
            isLoggedIn.value,
          )

          if (!isLoggedIn.value && currentRouteRequireAuth) {
            console.log('[AUTH] Redirecting to /login after auth initialization')
            redirectTo.value = currentRoute.path
            await navigateTo('/login')
          }
        }
      },
      { immediate: true },
    )

    // Attendre un tick pour éviter la redirection immédiate au démarrage
    let initialLoad = true

    watch(isLoggedIn, async (loggedIn) => {
      if (initialLoad) {
        initialLoad = false
        return
      }

      console.log('[AUTH] Watch isLoggedIn changed to:', loggedIn, 'currentRoute:', currentRoute.path)
      if (!loggedIn && currentRouteRequireAuth) {
        redirectTo.value = currentRoute.path
        console.log('[AUTH] Redirecting to /login because not logged in')
        await navigateTo('/login')
      }
    })

    watch(
      () => hasAnyRole(Array.isArray(currentRouteRequireRoles) ? currentRouteRequireRoles : []),
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
        user: computed(() => authStore.user),
        refresh: () => authStore.loadUserProfile(),
      },
    },
  }
})
