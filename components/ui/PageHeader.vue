<script lang="ts" setup>
defineProps<{
  title?: string
}>()

defineEmits<{
  (e: 'back'): void
}>()

const hasBack = ref(false);

onMounted(() => {
  const instance = getCurrentInstance() // only available inside lifecycle hooks
  hasBack.value = !!instance?.vnode.props?.onBack;
})
</script>

<template>
  <v-container>
    <v-row align-content="center">
      <v-col v-if="hasBack" cols="1" align-self="center">
        <v-btn variant="text" @click="$emit('back')" icon="mdi-arrow-left" size="small"></v-btn>
      </v-col>
      <v-col align-self="center">
        <slot name="title">
          <span class="text-h5">{{ title }}</span>
        </slot>
      </v-col>
      <v-col align-self="center">
        <slot name="content" />
      </v-col>
      <v-col class="extra" align-self="center">
        <slot name="extra" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.extra {
  display: flex;
  justify-content: flex-end;
}
</style>
