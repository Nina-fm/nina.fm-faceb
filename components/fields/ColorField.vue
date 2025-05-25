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
      <div class="flex gap-2">
        <FormControl>
          <ColorPicker
            :modelValue="componentField['modelValue']"
            :name="name"
            v-slot="{ color, show }"
            :placeholder="placeholder"
            class="w-full"
            @change="({ hex }) => componentField['onUpdate:modelValue']?.(hex)"
          >
            <div
              :class="cn('h-9 cursor-pointer rounded-lg border')"
              :style="{ backgroundColor: color.value }"
              @click="show"
            />
          </ColorPicker>
        </FormControl>
        <slot name="suffix" />
      </div>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style></style>
