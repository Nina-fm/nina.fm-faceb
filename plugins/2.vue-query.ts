import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryOptions: VueQueryPluginOptions = {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          // Durée de cache pour les requêtes (5 minutes)
          staleTime: 1000 * 60 * 5,
          // Durée de conservation en cache (10 minutes)
          gcTime: 1000 * 60 * 10,
          // Retry automatique en cas d'erreur
          retry: (failureCount, error: any) => {
            // Ne pas retry pour les erreurs 4xx (client errors)
            if (error?.status >= 400 && error?.status < 500) {
              return false
            }
            // Retry maximum 3 fois pour les erreurs serveur
            return failureCount < 3
          },
          // Fonction de retry avec délai progressif
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          // Refetch automatique quand la fenêtre reçoit le focus
          refetchOnWindowFocus: false,
          // Refetch automatique quand la connexion est rétablie
          refetchOnReconnect: true,
        },
        mutations: {
          // Retry automatique pour les mutations en cas d'erreur réseau
          retry: (failureCount, error: any) => {
            // Ne retry que pour les erreurs réseau/serveur
            if (!error?.status || error?.status >= 500) {
              return failureCount < 2
            }
            return false
          },
        },
      },
    },
  }

  nuxtApp.vueApp.use(VueQueryPlugin, vueQueryOptions)
})
