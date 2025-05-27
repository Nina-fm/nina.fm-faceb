<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      color: string
    }>(),
    {
      color: 'var(--secondary)',
    },
  )

  const foregroundColor = computed(() => getContrastYIQ(props.color))
</script>

<template>
  <Badge variant="outline" class="gap-2" :style="{ backgroundColor: color, color: foregroundColor }">
    <slot />
  </Badge>
</template>
