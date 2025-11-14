/**
 * Plugin d'authentification minimal
 * Gère l'hydration SSR et fournit les helpers auth
 */
export default defineNuxtPlugin(() => {
  const authComposable = useAuth()
  const { user } = authComposable

  // Client : Log pour debug
  if (import.meta.client) {
    console.log('[Auth Plugin] User hydrated:', user.value ? 'Yes' : 'No')
  }

  // Provide auth helper (optionnel, pour $auth dans templates)
  return {
    provide: {
      auth: () => authComposable,
    },
  }
})
