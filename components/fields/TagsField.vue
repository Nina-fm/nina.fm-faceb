<script lang="ts" setup>
  import type { Tag } from '~/types/api/tags.types'

  type Option = {
    label?: string
    value: Tag
    [key: string]: unknown
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

  const canCreate = computed(() => getCurrentInstance()?.vnode.props?.['create'] ?? false)
  const options = computed(() => (canCreate.value ? ([...props.options] as Option[]) : props.options))

  // Transform Option[] to Tag[] for form validation
  const handleUpdateModelValue = (options: Option[]) => {
    const tags = options.map((option) => option.value)
    return tags
  }

  // Transform Tag[] to Option[] for display
  const modelValueAsOptions = (tags: Tag[]): Option[] => {
    return tags.map((tag) => ({
      value: tag,
      label: tag.name,
    }))
  }
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <TagCombobox
          v-bind="props"
          :options="options"
          :model-value="modelValueAsOptions(componentField.modelValue || [])"
          @update:model-value="
            (value: Option[]) => componentField['onUpdate:modelValue']?.(handleUpdateModelValue(value))
          "
        />
      </FormControl>
      <FormDescription v-if="description" class="text-muted-foreground/60">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
