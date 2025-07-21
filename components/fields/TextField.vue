<script lang="ts" setup>
  withDefaults(
    defineProps<{
      name: string
      label?: string
      description?: string
      placeholder?: string
      multiline?: boolean
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
      <div class="flex gap-2">
        <FormControl>
          <Textarea v-if="multiline" v-bind="componentField" class="h-60" />
          <Input v-else v-bind="componentField" :placeholder="placeholder" />
        </FormControl>
        <slot name="suffix" />
      </div>
      <FormDescription v-if="description" class="text-muted-foreground/60">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style></style>
