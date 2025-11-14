<script setup lang="ts">
  const nuxtApp = useNuxtApp()
  const isLoading = ref(true)

  // Hide loading after app is fully initialized
  nuxtApp.hook('app:mounted', () => {
    isLoading.value = false
  })
</script>

<template>
  <!-- Loading overlay during initial auth check -->
  <div v-if="isLoading" class="bg-background fixed inset-0 z-50 flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent" />
      <p class="text-muted-foreground text-sm">Chargement...</p>
    </div>
  </div>

  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#ffb404" />
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <GlobalLoader />
</template>
