<script setup lang="ts">
  import type { NuxtError } from '#app'
  import { HomeIcon } from 'lucide-vue-next'

  const props = defineProps({
    error: Object as () => NuxtError,
  })

  const statusCode = computed(() => props.error?.statusCode || 500)

  const errorConfig = computed(() => {
    switch (statusCode.value) {
      case 401:
        return {
          title: 'Authentification requise',
          message: 'Vous devez vous connecter pour accéder à cette page.',
          redirect: '/login',
          buttonText: 'Se connecter',
        }
      case 403:
        return {
          title: 'Accès refusé',
          message: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
          redirect: '/',
          buttonText: "Retour à l'accueil",
        }
      case 404:
        return {
          title: 'Page introuvable',
          message: "La page que vous recherchez n'existe pas ou a été déplacée.",
          redirect: '/',
          buttonText: "Retour à l'accueil",
        }
      default:
        return {
          title: 'Erreur serveur',
          message: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.',
          redirect: '/',
          buttonText: "Retour à l'accueil",
        }
    }
  })

  const handleClearError = () => {
    // Force un rechargement complet pour éviter les boucles
    window.location.href = errorConfig.value.redirect
  }
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 py-16">
    <div class="text-primary mb-8 text-9xl font-bold opacity-20">
      {{ statusCode }}
    </div>

    <h1 class="mb-4 text-3xl font-bold">{{ errorConfig.title }}</h1>

    <p class="text-muted-foreground mb-8 max-w-md text-center">
      {{ errorConfig.message }}
    </p>

    <div v-if="error?.message" class="bg-muted mb-8 max-w-2xl rounded-lg p-4">
      <p class="text-muted-foreground font-mono text-sm">{{ error.message }}</p>
    </div>

    <Button size="lg" @click="handleClearError">
      <HomeIcon class="mr-2 size-4" />
      {{ errorConfig.buttonText }}
    </Button>
  </div>
</template>
