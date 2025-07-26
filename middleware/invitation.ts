// middleware/invitation.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  // On ne protège que la page /register
  if (to.path !== '/register') return

  // Vérifie la présence du token d'invitation dans l'URL
  const invitationToken = to.query.invitationToken
  if (!invitationToken) {
    // Redirige vers la page de login avec un paramètre d'erreur
    return navigateTo({ path: '/login', query: { error: 'invitation_required' } })
  }
})
