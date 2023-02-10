<script lang="ts" setup>
defineProps<{
  title?: string,
  actions?: {
    tooltip?: string,
    icon?: string,
    variant?: string,
    onClick?: (e: Event) => void
  }[]
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
          <span class="text-h5 text-primary">{{ title }}</span>
        </slot>
      </v-col>
      <v-col align-self="center">
        <slot name="content" />
      </v-col>
      <v-col class="extra" align-self="center">
        <slot name="extra">
          <template v-for="action in actions">
            <v-tooltip :text="action.tooltip" :disabled="!action.tooltip" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn variant="text" color="primary" :icon="action.icon" class="ml-2" @click="action.onClick"
                  v-bind="props" />
              </template>
            </v-tooltip>
          </template>
        </slot>
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
