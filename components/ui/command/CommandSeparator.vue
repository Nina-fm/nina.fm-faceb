<script setup lang="ts">
  import { cn } from '@/utils/utils'
  import { reactiveOmit } from '@vueuse/core'
  import type { SeparatorProps } from 'reka-ui'
  import { Separator } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'

  const props = defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>()

  const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <Separator v-bind="delegatedProps" :class="cn('bg-border -mx-1 h-px', props.class)">
    <slot />
  </Separator>
</template>
