import { getCookie } from 'h3'

/**
 * Server middleware pour hydrater l'authentification en SSR
 * Lit le cookie access_token et fetch le profil utilisateur depuis l'API
 * Injecte le user dans event.context pour l'hydration côté client
 */
export default defineEventHandler(async (event) => {
  // Ne traiter que les pages HTML (pas les API calls, assets, etc.)
  const path = event.path
  if (path.startsWith('/api') || path.startsWith('/_nuxt') || path.includes('.')) {
    return
  }

  console.log('[SSR AUTH] Processing path:', path)

  // Lire le cookie access_token
  const accessToken = getCookie(event, 'access_token')

  console.log('[SSR AUTH] Access token:', accessToken ? 'present' : 'missing')

  if (!accessToken) {
    event.context.user = null
    event.context.expiresAt = null
    return
  }

  try {
    // En SSR, on doit appeler directement l'API backend (pas le proxy)
    // Le proxy /api ne fonctionne que côté client
    const apiUrl = process.env.API_SERVER_URL || 'http://localhost:4000'

    console.log('[SSR AUTH] Calling API:', `${apiUrl}/auth/profile`)

    // Fetch user profile depuis l'API avec le cookie
    const response = await $fetch(`${apiUrl}/auth/profile`, {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    })

    // Injecter user dans context pour hydration
    const responseData = response as Record<string, unknown>
    event.context.user = responseData?.data || response
    event.context.expiresAt = null // On pourrait décoder le JWT pour avoir l'expiry

    console.log('[SSR AUTH] User loaded:', event.context.user ? 'yes' : 'no')
  } catch (error) {
    // Token invalide ou expiré
    console.warn('[SSR Auth] Failed to load user profile:', error)
    event.context.user = null
    event.context.expiresAt = null
  }
})
