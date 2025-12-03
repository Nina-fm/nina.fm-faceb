<script setup lang="ts">
  const props = defineProps<{
    usedAt: string | null
    expiresAt: string | null
  }>()

  const status = computed(() => getInvitationStatus(props.usedAt, props.expiresAt))

  const label = computed(() => {
    if (status.value === 'accepted') {
      return 'Acceptée'
    } else if (status.value === 'expired') {
      return 'Expirée'
    } else {
      return 'En attente'
    }
  })
  const variant = computed(() => {
    if (status.value === 'accepted') {
      return 'success'
    } else if (status.value === 'expired') {
      return 'destructive'
    } else {
      return 'info'
    }
  })
</script>

<template>
  <Badge :variant="`${variant}Muted`" class="flex w-fit justify-center rounded-full px-3 py-1">{{ label }}</Badge>
</template>
