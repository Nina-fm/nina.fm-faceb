<script lang="ts" setup>
  import type { FormContext } from 'vee-validate'
  import type { RouteLocationNormalized } from 'vue-router'

  type FormProps = {
    form: FormContext
  }

  const props = defineProps<FormProps>()
  const { form } = toRefs(props)

  const openConfirm = ref(false)
  const nextRoute = ref<string | null>(null)

  const handleCancelUnsaved = () => {
    openConfirm.value = false
    nextRoute.value = null
  }

  const handleConfirmUnsaved = async () => {
    form.value.resetForm()
    await navigateTo(nextRoute.value)
  }

  const endsWith = (name: string) => {
    return (to: RouteLocationNormalized) => {
      return to.name?.toString().endsWith(name)
    }
  }

  onBeforeRouteLeave((to, from, next) => {
    const isSafeRouting = to.name === from.name || (endsWith('-id-edit')(to) && endsWith('-add')(from))
    if (form.value.meta.value.dirty && !isSafeRouting) {
      nextRoute.value = to.fullPath
      openConfirm.value = true
    } else {
      next()
    }
  })
</script>

<template>
  <form v-bind="$attrs">
    <slot />
  </form>
  <ConfirmUnsavedDialog v-model="openConfirm" @confirm="handleConfirmUnsaved" @cancel="handleCancelUnsaved" />
</template>
