/**
 * Plugin d'authentification - CLIENT ONLY
 * Charge le user au mount côté client AVANT le premier rendu
 * Démarre le timer de refresh automatique si user authentifié
 *
 * IMPORTANT: Ce plugin ne s'exécute QUE côté client (env: { islands: false })
 */
export default defineNuxtPlugin({
  name: 'auth',
  enforce: 'pre',
  env: {
    islands: false, // Client-side only
  },
  async setup() {
    // Double protection: ne JAMAIS s'exécuter côté serveur
    if (import.meta.server) {
      return
    }

    const { fetchUser } = useAuth()
    const { startRefreshTimer } = useTokenRefresh()
    const route = useRoute()

    // Load user before rendering
    const user = await fetchUser()

    // If user loaded and on login/register page, redirect to home
    if (user && (route.path === '/login' || route.path === '/register')) {
      await navigateTo('/')
    }

    // Start refresh timer if user is authenticated
    if (user) {
      startRefreshTimer()
    }
  },
})
