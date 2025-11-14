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

  // Lire le cookie access_token
  const accessToken = getCookie(event, 'access_token')

  if (!accessToken) {
    event.context.user = null
    event.context.expiresAt = null
    return
  }

  try {
    const config = useRuntimeConfig()

    // Fetch user profile depuis l'API avec le cookie
    const response = await $fetch(`${config.public.apiUrl}/auth/profile`, {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
    })

    // Injecter user dans context pour hydration
    const responseData = response as Record<string, unknown>
    event.context.user = responseData?.data || response
    event.context.expiresAt = null // On pourrait décoder le JWT pour avoir l'expiry
  } catch (error) {
    // Token invalide ou expiré
    console.warn('[SSR Auth] Failed to load user profile:', error)
    event.context.user = null
    event.context.expiresAt = null
  }
})
