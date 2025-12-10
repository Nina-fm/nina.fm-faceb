/**
 * Plugin d'authentification SuperTokens - CLIENT ONLY
 *
 * Initialise le SDK SuperTokens qui gère automatiquement :
 * - Interception des fetch pour ajouter credentials
 * - Refresh automatique des tokens sur 401
 * - Refresh proactif avant expiration
 * - Synchronisation multi-onglets
 * - Reset password via email
 */
import SuperTokens from 'supertokens-web-js'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
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
        websiteDomain: window.location.origin,
        websiteBasePath: '/auth',
      },
      recipeList: [
        EmailPassword.init({
          signInAndUpFeature: {
            disableDefaultUI: true, // On utilise nos propres pages
          },
          resetPasswordUsingTokenFeature: {
            disableDefaultUI: true, // On utilise notre propre page /set-password
          },
          resetPasswordUsingToken: {
            // Configurer la redirection vers notre page custom
            onHandleResetPasswordUsingToken: async (context) => {
              // Rediriger vers notre page avec le token
              window.location.href = `/set-password?token=${context.token}`
            },
          },
        }),
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

    // Pages qui ne nécessitent pas de session utilisateur
    const publicPages = ['/set-password', '/reset-password', '/login', '/register', '/forgot-password']

    // Load user from SuperTokens session (sauf pour les pages publiques)
    if (!publicPages.includes(route.path)) {
      const user = await fetchUser()

      // If user on login/register page, redirect home
      if (user && (route.path === '/login' || route.path === '/register')) {
        await navigateTo('/')
      }
    }
  },
})
