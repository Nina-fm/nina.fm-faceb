/**
 * Plugin d'authentification ultra-léger - CLIENT ONLY
 *
 * Charge simplement le user au mount côté client.
 * SuperTokens gère automatiquement :
 * - Les cookies httpOnly
 * - Le refresh des tokens
 * - L'expiration des sessions
 */
export default defineNuxtPlugin({
  name: 'auth',
  enforce: 'pre',
  env: {
    islands: false, // Client-side only
  },
  async setup() {
    if (import.meta.server) {
      return
    }

    const { fetchUser } = useAuth()
    const route = useRoute()

    // Load user from SuperTokens session
    const user = await fetchUser()

    // If user on login/register page, redirect home
    if (user && (route.path === '/login' || route.path === '/register')) {
      await navigateTo('/')
    }
  },
})
