<script lang="ts" setup>
  import type { BadgeVariants } from '~/components/ui/badge'

  withDefaults(
    defineProps<{
      label?: string
      variant?: BadgeVariants['variant']
    }>(),
    {
      variant: 'secondary',
    },
  )
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Badge :variant="variant" class="m-0 size-5 p-0">
          <slot />
        </Badge>
      </TooltipTrigger>
      <TooltipContent class="">
        <span>{{ label }}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
