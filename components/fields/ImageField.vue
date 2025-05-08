<script lang="ts" setup>
  withDefaults(
    defineProps<{
      name: string
      label?: string
      description?: string
      placeholder?: string
    }>(),
    {
      placeholder: '',
    },
  )
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <Dropzone :modelValue="componentField.modelValue" @update:model-value="componentField['onUpdate:modelValue']" />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style></style>
