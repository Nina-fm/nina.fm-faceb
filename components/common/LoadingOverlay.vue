<script lang="ts" setup>
  import { VisuallyHidden } from 'reka-ui'

  defineProps<{
    active: boolean
  }>()
</script>

<template>
  <Dialog :open="active">
    <DialogContent class="border-none bg-transparent" :closable="false">
      <VisuallyHidden as-child>
        <DialogHeader>
          <DialogTitle>Chargement...</DialogTitle>
          <DialogDescription />
        </DialogHeader>
      </VisuallyHidden>
      <div class="flex flex-col items-center justify-center">
        <AnimatedLoader />
      </div>
    </DialogContent>
  </Dialog>
</template>
