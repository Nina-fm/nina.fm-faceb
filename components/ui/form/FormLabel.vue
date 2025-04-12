<script lang="ts" setup>
  import { Label } from '@/components/ui/label'
  import { cn } from '@/lib/utils'
  import type { LabelProps } from 'reka-ui'
  import type { HTMLAttributes } from 'vue'
  import { useFormField } from './useFormField'

  const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

  const { error, formItemId } = useFormField()
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="
      cn(
        'data-[error=true]:text-destructive-foreground text-muted-foreground text-xs font-light tracking-wider uppercase',
        props.class,
      )
    "
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
