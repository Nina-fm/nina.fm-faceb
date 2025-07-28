<script setup lang="ts">
  const props = defineProps<{
    usedAt: string | null
    expiresAt: string | null
  }>()

  const isUsed = computed(() => props.usedAt !== null)
  const isExpired = computed(() => {
    return props.expiresAt !== null && new Date(props.expiresAt) < new Date()
  })

  const status = computed(() => {
    if (isUsed.value) {
      return 'Acceptée'
    } else if (isExpired.value) {
      return 'Expirée'
    } else {
      return 'En attente'
    }
  })

  const variant = computed(() => {
    if (isUsed.value) {
      return 'success'
    } else if (isExpired.value) {
      return 'destructive'
    } else {
      return 'info'
    }
  })
</script>

<template>
  <Alert :variant="variant" class="flex w-fit justify-center rounded-full px-3 py-1">{{ status }}</Alert>
</template>
