<script lang="ts" setup>
defineProps<{
  title?: string
  actions?: {
    tooltip?: string
    icon?: string
    variant?: string
    onClick?: (e: Event) => void
  }[]
}>()

defineEmits<{
  (e: "back"): void
}>()

const hasBack = ref(false)

onMounted(() => {
  const instance = getCurrentInstance() // only available inside lifecycle hooks
  hasBack.value = !!instance?.vnode.props?.onBack
})
</script>

<template>
  <v-container>
    <v-row align-content="center">
      <v-col v-if="hasBack" cols="1" align-self="center">
        <v-btn variant="text" icon="mdi-arrow-left" size="small" @click="$emit('back')" />
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
          <template v-for="(action, index) in actions" :key="index">
            <v-tooltip :text="action.tooltip" :disabled="!action.tooltip" location="bottom">
              <template #activator="{ props: activatorProps }">
                <v-btn
                  variant="text"
                  color="primary"
                  :icon="action.icon"
                  class="ml-2"
                  v-bind="activatorProps"
                  @click="action.onClick"
                />
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
