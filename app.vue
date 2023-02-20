<script lang="ts" setup>
const { user } = useAuthStoreRefs();
const { isLoading, loadingPercent } = useLoadingStoreRefs()
const { snackbars } = useSnackbarStoreRefs()

</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
  <Loading :model-value="isLoading" :percent-value="loadingPercent" />
<Notifier v-model="snackbars" />
</template>

<style></style>




