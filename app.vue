<script lang="ts" setup>
  useAuthStoreRefs()
  useProfileStoreRefs()
  const { loading, loadingPercent } = useLoadingStoreRefs()
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#ffb404" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- <Loading :model-value="loading" :percent-value="loadingPercent" /> -->
  <ClientOnly>
    <Toaster />
  </ClientOnly>
</template>
