<script lang="ts" setup>
  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      description?: string
      placeholder?: string
      options?: { value: string; label: string }[] | string[]
    }>(),
    {
      placeholder: 'Selectionner…',
    },
  )

  const options = computed(() =>
    props.options?.map((option) => (typeof option === 'string' ? { value: option, label: option } : option)),
  )
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <Select v-bind="componentField">
        <FormControl class="w-full">
          <SelectTrigger>
            <SelectValue :placeholder="placeholder" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label ?? option.value }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style></style>
