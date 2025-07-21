<script lang="ts" setup>
  import { GripVerticalIcon, ListXIcon, PlusIcon, Trash2Icon } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      name: string
      label: string
      description?: string
      placeholder?: string
      objectFields?: {
        type: 'text' | 'time'
        label: string
        hint?: string
        name: string
        class?: string
      }[]
    }>(),
    {
      placeholder: 'Aucune donnée',
    },
  )

  const emits = defineEmits<{
    (e: 'deleteRow', index: number): void
    (e: 'addRow'): void
    (e: 'clearAll'): void
  }>()

  const { value: field, setValue } = useField<any[]>(() => props.name)

  const handleClearAll = () => {
    setValue([])
    emits('clearAll')
  }

  const handleAddRow = () => {
    const newRow = props.objectFields?.reduce(
      (acc, field) => {
        acc[field.name] = field.type === 'time' ? null : ''
        return acc
      },
      {} as Record<string, any>,
    )

    setValue([...(field.value ?? []), newRow])
    emits('addRow')
  }

  const handleDeleteRow = (index: number) => {
    const newField = [...(field.value ?? [])]
    newField.splice(index, 1)
    setValue(newField)
    emits('deleteRow', index)
  }
</script>

<template>
  <FormItem v-bind="$attrs" class="space-y-0">
    <FormLabel v-if="label">{{ label }}</FormLabel>
    <FormControl>
      <Card :class="cn('bg-input/30 relative rounded-md py-4.5', { 'pt-8 pb-4': field?.length })">
        <div class="absolute top-0.5 right-0 flex items-baseline gap-1 px-3 pt-1">
          <Tooltiped text="Supprimer toutes les pistes">
            <Button type="button" variant="ghost" size="icon-sm" @click.prevent.stop="handleClearAll">
              <ListXIcon />
            </Button>
          </Tooltiped>
          <Tooltiped text="Ajouter une piste">
            <Button type="button" variant="ghost" size="icon-sm" @click.prevent.stop="handleAddRow">
              <PlusIcon />
            </Button>
          </Tooltiped>
          <slot name="actions" />
        </div>

        <div v-if="!field?.length" class="flex h-0 flex-col items-center justify-center gap-2">
          <span class="text-muted-foreground text-xs">{{ placeholder }}</span>
        </div>

        <div v-else class="mr-2 ml-4 flex flex-col gap-2">
          <div class="flex gap-2">
            <div class="flex w-3"></div>
            <div
              v-for="objectField in objectFields"
              :key="`label-${objectField.name}`"
              :class="cn('flex-1', objectField.class)"
            >
              <FormLabel class="text-muted-foreground text-xs">
                {{ objectField.label }}
                <span v-if="objectField.hint" class="text-muted-foreground/60 text-xs lowercase">
                  {{ objectField.hint }}
                </span>
              </FormLabel>
            </div>
            <div class="flex w-20" />
          </div>
          <div v-for="(object, i) in field" :key="`row-${i}`" class="flex gap-2">
            <div class="text-muted-foreground flex w-3 items-start justify-start pt-2 text-xs">{{ i + 1 }}</div>
            <div v-for="objectField in objectFields" :key="objectField.name" :class="cn('flex-1', objectField.class)">
              <TimecodeField
                v-if="objectField.type === 'time'"
                :name="`${name}.${i}.${objectField.name}`"
                v-model="object[objectField.name]"
                class="w-full"
              />
              <TextField
                v-else
                :name="`${name}.${i}.${objectField.name}`"
                v-model="object[objectField.name]"
                class="w-full"
              />
            </div>
            <div class="flex w-20 items-start gap-1 pb-2">
              <Button size="icon" variant="muted" @click="() => handleDeleteRow(i)">
                <Trash2Icon />
              </Button>
              <Button size="icon" variant="muted"><GripVerticalIcon /></Button>
            </div>
          </div>
        </div>
      </Card>
    </FormControl>
    <FormDescription v-if="description">{{ description }}</FormDescription>
    <FormMessage />
  </FormItem>
</template>

<style></style>
