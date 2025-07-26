<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '~/stores/auth'

  const authStore = useAuthStore()
  const { isLoading, isAuthChecking } = storeToRefs(authStore)

  const loading = computed(() => isLoading.value || isAuthChecking.value)
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#ffb404" />
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <LoadingFullscreen :active="loading" />
</template>
