<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '~/stores/auth'

  const authStore = useAuthStore()
  const { isLoading, isAuthChecking } = storeToRefs(authStore)
</script>

<template>
  <ClientOnly>
    <!-- Une fois hydraté côté client, utilise tes flags Pinia -->
    <LoadingFullscreen :active="isLoading || isAuthChecking" />

    <!-- Pendant l'hydratation SSR->Client, affiche toujours le loader -->
    <template #fallback>
      <LoadingFullscreen :active="true" />
    </template>
  </ClientOnly>
</template>
