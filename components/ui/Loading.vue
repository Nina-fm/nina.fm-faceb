<script lang="ts" setup>
defineProps<{
  modelValue?: boolean,
}>()
</script>

<template>
  <div class="n-loading">
    <v-overlay :model-value="modelValue" absolute :persistent="true" :close-on-back="false"
      :close-on-content-click="false">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </v-overlay>
  </div>
</template>

<style scoped>
:deep(.v-overlay__content) {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
