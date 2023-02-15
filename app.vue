<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useAuthStore());
const { isLoading, loadingPercent } = storeToRefs(useLoadingStore())
const { snackbars } = storeToRefs(useSnackbarStore())

</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
  <Loading :model-value="isLoading" :percent-value="loadingPercent" />
  <Notifier v-model="snackbars" />
</template>

<style>

</style>




