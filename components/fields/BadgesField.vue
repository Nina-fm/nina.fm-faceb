<script lang="ts" setup>
  const props = defineProps<{
    name: string
    label: string
    description?: string
    placeholder?: string
    itemLabelKey?: string
  }>()
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <TagsInput
          :model-value="componentField.modelValue"
          :displayValue="
            (value) => (typeof value === 'object' && props.itemLabelKey ? value?.[props.itemLabelKey] : value)
          "
          @update:model-value="componentField['onUpdate:modelValue']"
        >
          <TagsInputItem v-for="item in componentField.modelValue" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput :placeholder="placeholder" />
        </TagsInput>
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
