/**
 * Plugin d'authentification
 * Charge le user au mount côté client AVANT le premier rendu
 */
export default defineNuxtPlugin({
  name: 'auth',
  enforce: 'pre',
  async setup() {
    if (import.meta.client) {
      const { fetchUser } = useAuth()
      const route = useRoute()

      // Load user before rendering
      const user = await fetchUser()

      // If user loaded and on login/register page, redirect to home
      if (user && (route.path === '/login' || route.path === '/register')) {
        await navigateTo('/')
      }
    }
  },
})
