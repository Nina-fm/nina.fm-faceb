/**
 * Plugin d'authentification SuperTokens - CLIENT ONLY
 *
 * Initialise le SDK SuperTokens qui gère automatiquement :
 * - Interception des fetch pour ajouter credentials
 * - Refresh automatique des tokens sur 401
 * - Refresh proactif avant expiration
 * - Synchronisation multi-onglets
 */
import SuperTokens from 'supertokens-web-js'
import Session from 'supertokens-web-js/recipe/session'

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

    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl as string

    // Initialiser SuperTokens SDK
    SuperTokens.init({
      appInfo: {
        appName: 'Nina.fm Face B',
        apiDomain: apiUrl,
        apiBasePath: '/auth',
      },
      recipeList: [
        Session.init({
          tokenTransferMethod: 'cookie',
          onHandleEvent: (context) => {
            if (context.action === 'UNAUTHORISED') {
              // Session expirée et refresh échoué
              // Ne pas rediriger si déjà sur /login (évite boucle infinie)
              if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login'
              }
            }
          },
        }),
      ],
    })

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
