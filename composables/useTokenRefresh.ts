/**
 * Composable pour gérer le refresh automatique du token
 *
 * - Lance un timer qui refresh le token 5min avant expiration (à 25min sur 30min)
 * - Peut être appelé manuellement pour forcer un refresh
 * - Se nettoie automatiquement au logout
 */

import type { User } from '~/types/api/users.types'

export const useTokenRefresh = () => {
  const { user, expiresAt, setUser, clearUser } = useAuth()

  // Timer ID pour pouvoir le clear
  let refreshTimer: NodeJS.Timeout | null = null

  /**
   * Appelle l'endpoint /auth/refresh pour obtenir un nouveau token
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await $fetch<{ user: User; expiresAt: number }>('/auth/refresh', {
        baseURL: useRuntimeConfig().public.apiUrl,
        method: 'POST',
        credentials: 'include', // Important pour envoyer les cookies
      })

      if (response.user && response.expiresAt) {
        setUser(response.user, response.expiresAt)
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Si le refresh échoue, on déconnecte l'utilisateur
      clearUser()
      await navigateTo('/login')
      return false
    }
  }

  /**
   * Calcule le délai avant le prochain refresh
   * Refresh 5min avant expiration (30min - 5min = 25min)
   */
  const getRefreshDelay = (): number => {
    if (!expiresAt.value) return 0

    const now = Date.now()
    const expiresAtMs = expiresAt.value * 1000 // expiresAt est en secondes
    const timeUntilExpiry = expiresAtMs - now

    // Refresh 5min avant expiration (300000ms = 5min)
    const refreshBuffer = 5 * 60 * 1000
    const refreshDelay = timeUntilExpiry - refreshBuffer

    // Si le token expire dans moins de 5min, refresh immédiatement
    return Math.max(0, refreshDelay)
  }

  /**
   * Démarre le timer de refresh automatique
   */
  const startRefreshTimer = () => {
    // Clear le timer existant si présent
    stopRefreshTimer()

    if (!user.value || !expiresAt.value) {
      return
    }

    const delay = getRefreshDelay()

    if (delay === 0) {
      // Token expire bientôt, refresh immédiatement
      refreshToken().then((success) => {
        if (success) {
          // Relancer le timer après le refresh
          startRefreshTimer()
        }
      })
    } else {
      // Planifier le refresh
      refreshTimer = setTimeout(async () => {
        const success = await refreshToken()
        if (success) {
          // Relancer le timer après le refresh
          startRefreshTimer()
        }
      }, delay)

      if (import.meta.dev) {
        const delayMinutes = Math.round(delay / 1000 / 60)
        console.log(`🔄 Token refresh scheduled in ${delayMinutes} minutes`)
      }
    }
  }

  /**
   * Arrête le timer de refresh
   */
  const stopRefreshTimer = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
      if (import.meta.dev) {
        console.log('⏹️ Token refresh timer stopped')
      }
    }
  }

  // Cleanup au unmount du composable
  if (import.meta.client) {
    onUnmounted(() => {
      stopRefreshTimer()
    })
  }

  return {
    refreshToken,
    startRefreshTimer,
    stopRefreshTimer,
  }
}
