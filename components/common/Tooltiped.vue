<script lang="ts" setup>
  defineProps<{
    text?: string
  }>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger><slot /></TooltipTrigger>
      <TooltipContent>
        <slot name="content">{{ text }}</slot>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
