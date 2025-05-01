<script lang="ts" setup>
  import { ShieldUserIcon } from 'lucide-vue-next'
  defineProps<{
    name?: string
  }>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Badge variant="successMuted" class="size-5 p-0">
          <ShieldUserIcon />
        </Badge>
      </TooltipTrigger>
      <TooltipContent class="">
        <span>Administrateur</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
