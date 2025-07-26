<script lang="ts" setup>
  // useAuthStoreRefs()
  // useProfileStoreRefs()
  // const { loading, loadingPercent } = useLoadingStoreRefs()
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#ffb404" />
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- <Loading :model-value="loading" :percent-value="loadingPercent" /> -->
</template>
