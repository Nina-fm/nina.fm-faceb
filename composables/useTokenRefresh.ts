/**
 * Composable pour gérer le refresh automatique du token SuperTokens
 *
 * Note: SuperTokens gère automatiquement le refresh via son SDK frontend.
 * Ce composable est simplifié pour compatibilité avec l'architecture existante.
 * Le refresh se fait automatiquement via les cookies httpOnly.
 */

import type { User } from '~/types/api/users.types'

export const useTokenRefresh = () => {
  const { setUser, clearUser } = useAuth()

  /**
   * Force un refresh de session SuperTokens
   * En pratique, SuperTokens gère ça automatiquement, mais on peut forcer si nécessaire
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await $fetch<User>('/auth/session/refresh', {
        baseURL: useRuntimeConfig().public.apiUrl,
        method: 'POST',
        credentials: 'include', // Important pour envoyer les cookies SuperTokens
      })

      if (response) {
        setUser(response, null)
        return true
      }
      return false
    } catch (error) {
      console.error('[SuperTokens] Token refresh failed:', error)
      // Si le refresh échoue, on déconnecte l'utilisateur
      clearUser()
      await navigateTo('/login')
      return false
    }
  }

  /**
   * No-op: SuperTokens gère le refresh automatiquement
   * Conservé pour compatibilité avec l'architecture existante
   */
  const startRefreshTimer = () => {
    if (import.meta.dev) {
      console.log('[SuperTokens] Token refresh géré automatiquement par SuperTokens SDK')
    }
  }

  /**
   * No-op: Pas de timer à arrêter avec SuperTokens
   * Conservé pour compatibilité
   */
  const stopRefreshTimer = () => {
    // Rien à faire
  }

  return {
    refreshToken,
    startRefreshTimer,
    stopRefreshTimer,
  }
}
