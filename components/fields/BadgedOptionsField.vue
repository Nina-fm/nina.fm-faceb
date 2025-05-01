<script lang="ts" setup>
  const props = defineProps<{
    name: string
    label: string
    description?: string
    placeholder?: string
    optionLabelKey?: string
    options:
      | string[]
      | {
          label?: string
          value: any
          [key: string]: any
        }[]
  }>()
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <TagCombobox
          v-bind="props"
          :modelValue="componentField.modelValue"
          @update:model-value="componentField['onUpdate:modelValue']"
        />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
