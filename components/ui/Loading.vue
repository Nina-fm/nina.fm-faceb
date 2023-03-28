<script lang="ts" setup>
const props = defineProps<{
  modelValue?: boolean
  percentValue?: number | null
}>()

const { percentValue } = toRefs(props)
</script>

<template>
  <div class="n-loading">
    <v-overlay
      :model-value="modelValue"
      absolute
      :persistent="true"
      :close-on-back="false"
      :close-on-content-click="false"
    >
      <v-progress-circular v-if="percentValue" :rotate="360" :model-value="percentValue" :size="70" color="primary">
        {{ percentValue }}%
      </v-progress-circular>
      <v-progress-circular v-else :size="50" color="primary" indeterminate></v-progress-circular>
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
