<script setup lang="ts">
  import type { NuxtError } from '#app'
  import { errors } from '@/utils/errors'

  const props = defineProps({
    error: Object as () => NuxtError,
  })

  const statusCode = props.error?.statusCode || 500
  const { statusMessage, message, redirect, buttonText } = errors[statusCode]
</script>

<template>
  <NuxtLayout name="naked">
    <AuthBox :title="`${statusMessage}`" :subtitle="`Code erreur ${statusCode}`">
      <p class="text-center text-sm text-gray-500">
        {{ message }}
      </p>
      <template #footer>
        <NuxtLink :to="redirect" external>{{ buttonText }}</NuxtLink>
      </template>
    </AuthBox>
  </NuxtLayout>
</template>
