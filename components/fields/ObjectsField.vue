<script lang="ts" setup>
  import { GripVerticalIcon, Trash2Icon } from 'lucide-vue-next'

  withDefaults(
    defineProps<{
      name: string
      label: string
      description?: string
      placeholder?: string
      objectFields?: {
        type: 'text' | 'select'
        label: string
        name: string
      }[]
    }>(),
    {
      placeholder: 'Aucune donnée',
    },
  )
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem v-bind="$attrs" class="space-y-0">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <Card class="rounded-md py-4">
          <div v-if="!componentField.modelValue.length" class="flex h-0 flex-col items-center justify-center gap-2">
            <span class="text-muted-foreground text-xs">{{ placeholder }}</span>
          </div>

          <div v-else class="flex flex-col gap-2">
            <div class="flex gap-2">
              <div class="w-3"></div>
              <FormLabel
                v-for="objectField in objectFields"
                :key="`label-${objectField.name}`"
                class="text-muted-foreground flex-1 text-xs"
              >
                {{ objectField.label }}
              </FormLabel>
              <div class="w-20" />
            </div>
            <div v-for="(object, i) in componentField.modelValue" :key="object.id" class="flex gap-2">
              <div class="text-muted-foreground flex w-3 items-center justify-start text-xs">{{ i + 1 }}</div>
              <div v-for="objectField in objectFields" :key="objectField.name" class="flex-1">
                <TextField
                  :name="`${name}.${i}.${objectField.name}`"
                  v-model="object[objectField.name]"
                  :placeholder="objectField.label"
                />
              </div>
              <div class="flex w-20 items-end gap-1 pb-2">
                <Button size="icon" variant="destructiveOutline"><Trash2Icon /></Button>
                <Button size="icon" variant="ghost"><GripVerticalIcon /></Button>
              </div>
            </div>
          </div>
        </Card>
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style></style>
