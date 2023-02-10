<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const { user } = storeToRefs(useAuthStore());
const { isLoading } = storeToRefs(useLoadingStore())
const { snackbars } = storeToRefs(useSnackbarStore())

</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
  <Loading v-model="isLoading" />
  <Notifier v-model="snackbars" />
</template>

<style>

</style>




