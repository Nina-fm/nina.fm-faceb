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
    (e: 'back'): void
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
  <div class="flex items-end gap-8">
    <div class="flex flex-col gap-2">
      <SidebarBreadcrumb />
      <h1 class="text-2xl font-light tracking-wider">{{ title }}</h1>
    </div>
    <div class="flex-1">
      <slot name="content" />
    </div>
    <div class="flex justify-end gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
  .extra {
    display: flex;
    justify-content: flex-end;
  }
</style>
