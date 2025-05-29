<script lang="ts" setup>
  import type { BadgeVariants } from '~/components/ui/badge'

  withDefaults(
    defineProps<{
      tooltip?: string
      variant?: BadgeVariants['variant']
    }>(),
    {
      variant: 'secondary',
    },
  )
</script>

<template>
  <Tooltiped :text="tooltip">
    <Badge :variant="variant" class="m-0 size-5 p-0">
      <slot />
    </Badge>
  </Tooltiped>
</template>
