<script setup lang="ts">
  defineProps<{ active: boolean }>()
</script>

<template>
  <!-- <transition name="fade"> -->
  <div v-if="active" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
    <div class="flex flex-col items-center justify-center">
      <AnimatedLoader />
    </div>
  </div>
  <!-- </transition> -->
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
