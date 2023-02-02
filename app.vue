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
  <v-snackbar v-for="snack in snackbars" :model-value="true" :timeout="snack.duration" :color="snack.color">
    {{ snack.message }}
  </v-snackbar>
  <Loading v-model="isLoading" />
</template>

<style>

</style>




