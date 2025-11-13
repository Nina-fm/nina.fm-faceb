<script lang="ts" setup>
  import { CheckIcon, EllipsisIcon, LoaderCircleIcon, SaveIcon } from 'lucide-vue-next'

  const props = defineProps<{
    pending?: boolean
    dirty?: boolean
    success?: boolean
  }>()

  defineEmits<{
    submit: []
  }>()

  const variant = computed(() => {
    if (props.pending) return 'primaryMuted'
    if (props.dirty) return 'primaryOutline'
    if (props.success) return 'successMuted'
    return 'muted'
  })

  const disabled = computed(() => !props.dirty || props.pending)
</script>

<template>
  <Button size="fab" :variant="variant" :disabled="disabled" @click="$emit('submit')">
    <LoaderCircleIcon v-if="pending" class="animate-spin" />
    <SaveIcon v-else-if="dirty" />
    <CheckIcon v-else-if="success" />
    <EllipsisIcon v-else />
  </Button>
</template>
