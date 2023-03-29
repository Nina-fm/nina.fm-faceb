<script lang="ts" setup>
const props = defineProps<{
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

const slots = useSlots()
const { actions } = toRefs(props)
const hasBack = ref(false)
const titleCols = computed(() => {
  let xs = 12
  let sm = 12

  if (actions?.value?.length && slots.content) {
    xs = 6
    sm = 4
  } else if (actions?.value?.length && !slots.content) {
    xs = 6
    sm = 6
  } else if (!actions?.value?.length && slots.content) {
    xs = 12
    sm = 6
  }

  return {
    xs: hasBack.value ? xs - 1 : xs,
    sm: hasBack.value ? sm - 1 : sm,
  }
})
const contentCols = computed(() => ({
  xs: 12,
  sm: actions?.value?.length ? 4 : 6,
}))
const actionsCols = computed(() => ({
  xs: 6,
  sm: slots.content ? 4 : 6,
}))

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
      <v-col :cols="titleCols.xs" :sm="titleCols.sm" align-self="center">
        <slot name="title">
          <span class="text-h5 text-primary">{{ title }}</span>
        </slot>
      </v-col>
      <v-col
        v-if="$slots.content"
        :cols="contentCols.xs"
        :sm="contentCols.sm"
        :class="`order-last order-sm-${hasBack ? 3 : 2}`"
        align-self="center"
      >
        <slot name="content" />
      </v-col>
      <v-col
        v-if="actions?.length"
        :cols="actionsCols.xs"
        :sm="actionsCols.sm"
        :class="`extra order-${hasBack ? 3 : 2} order-sm-last`"
        align-self="center"
      >
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
