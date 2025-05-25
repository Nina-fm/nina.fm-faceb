<script lang="ts" setup>
  type Options =
    | {
        label?: string
        value: any
        [key: string]: any
      }[]
    | string[]

  const props = defineProps<{
    name: string
    label: string
    description?: string
    placeholder?: string
    optionLabelKey?: string
    options: Options
    createOptionLabel?: string
  }>()
  const emit = defineEmits<{
    (e: 'create', value: string): void
  }>()

  const canCreate = computed(() => getCurrentInstance()?.vnode.props?.['create'] ?? false)
  const options = computed(() => (canCreate.value ? ([...props.options] as Options) : props.options))
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <TagCombobox
          v-bind="props"
          :options="options"
          :modelValue="componentField.modelValue"
          @update:model-value="componentField['onUpdate:modelValue']"
        />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
