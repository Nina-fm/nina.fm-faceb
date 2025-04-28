<script lang="ts" setup>
  defineProps<{
    active: boolean
  }>()
</script>

<template>
  <Dialog :open="active">
    <DialogContent class="border-none bg-transparent">
      <div class="flex flex-col items-center justify-center">
        <AnimatedLoader />
      </div>
    </DialogContent>
  </Dialog>
</template>
