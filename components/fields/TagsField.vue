<script lang="ts" setup>
  import type { Tag } from '~/types/api/tags.types'

  type Option = {
    label?: string
    value: Tag
    [key: string]: any
  }

  const props = defineProps<{
    name: string
    label: string
    description?: string
    placeholder?: string
    optionLabelKey?: string
    options: Option[]
    createOptionLabel?: string
  }>()
  const emit = defineEmits<{
    (e: 'create', value: Tag): void
  }>()

  const canCreate = computed(() => getCurrentInstance()?.vnode.props?.['create'] ?? false)
  const options = computed(() => (canCreate.value ? ([...props.options] as Option[]) : props.options))
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <TagCombobox
          v-bind="props"
          :options="options"
          :model-value="componentField.modelValue"
          @update:model-value="componentField['onUpdate:modelValue']"
        />
      </FormControl>
      <FormDescription v-if="description" class="text-muted-foreground/60">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
