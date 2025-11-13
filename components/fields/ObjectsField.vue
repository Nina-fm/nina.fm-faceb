<script lang="ts" setup>
  import { GripVerticalIcon, ListXIcon, PlusIcon, Trash2Icon } from 'lucide-vue-next'
  import { FieldArray, useFieldArray } from 'vee-validate'

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
      description: undefined,
      objectFields: undefined,
    },
  )

  const emits = defineEmits<{
    (e: 'deleteRow', index: number): void
    (e: 'addRow' | 'clearAll'): void
  }>()

  // Use useFieldArray to access replace() method
  const { replace, fields: fieldArrayFields } = useFieldArray(() => props.name)

  const handleClearAll = () => {
    replace([])
    emits('clearAll')
  }

  // Drag and drop state
  const draggedIndex = ref<number | null>(null)
  const dropTargetIndex = ref<number | null>(null)

  const handleDragStart = (index: number) => {
    draggedIndex.value = index
  }

  const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault()
    dropTargetIndex.value = index
  }

  const handleDragLeave = () => {
    dropTargetIndex.value = null
  }

  const handleDrop = (event: DragEvent, targetIndex: number) => {
    event.preventDefault()
    if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
      draggedIndex.value = null
      dropTargetIndex.value = null
      return
    }

    // Reorder the array
    const items = [...fieldArrayFields.value]
    const [draggedItem] = items.splice(draggedIndex.value, 1)
    if (draggedItem) {
      items.splice(targetIndex, 0, draggedItem)
    }

    // Update with new order
    replace(items.map((item) => item.value))
    draggedIndex.value = null
    dropTargetIndex.value = null
  }

  const handleDragEnd = () => {
    draggedIndex.value = null
    dropTargetIndex.value = null
  }
</script>

<template>
  <FieldArray v-slot="{ fields, remove, push }" :name="name">
    <FormItem v-bind="$attrs" class="space-y-0">
      <FormLabel v-if="label">{{ label }}</FormLabel>
      <FormControl>
        <Card :class="cn('bg-input/30 relative rounded-md py-4.5', { 'pt-8 pb-4': fields.length })">
          <div class="absolute top-0.5 right-0 flex items-baseline gap-1 px-3 pt-1">
            <Tooltiped text="Supprimer toutes les pistes">
              <Button type="button" variant="ghost" size="icon-sm" @click.prevent.stop="handleClearAll">
                <ListXIcon />
              </Button>
            </Tooltiped>
            <Tooltiped text="Ajouter une piste">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                @click.prevent.stop="
                  () => {
                    const newRow = objectFields?.reduce(
                      (acc, field) => {
                        acc[field.name] = field.type === 'time' ? null : ''
                        return acc
                      },
                      {} as Record<string, any>,
                    )
                    push(newRow)
                    emits('addRow')
                  }
                "
              >
                <PlusIcon />
              </Button>
            </Tooltiped>
            <slot name="actions" />
          </div>

          <div v-if="!fields.length" class="flex h-0 flex-col items-center justify-center gap-2">
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
            <div
              v-for="(field, i) in fields"
              :key="field.key"
              :class="
                cn('relative flex gap-2 rounded-md p-1 transition-all', {
                  'bg-muted scale-[0.98] opacity-60': draggedIndex === i,
                  'bg-primary/5': dropTargetIndex === i && draggedIndex !== i && draggedIndex !== null,
                })
              "
              @dragover="(e) => handleDragOver(e, i)"
              @dragleave="handleDragLeave"
              @drop="(e) => handleDrop(e, i)"
            >
              <!-- Drop indicator line -->
              <div
                v-if="dropTargetIndex === i && draggedIndex !== i && draggedIndex !== null"
                class="bg-primary absolute -top-0.5 right-0 left-0 h-1 rounded-full"
              />
              <div class="text-muted-foreground flex w-3 items-start justify-start pt-2 text-xs">{{ i + 1 }}</div>
              <div v-for="objectField in objectFields" :key="objectField.name" :class="cn('flex-1', objectField.class)">
                <TimecodeField
                  v-if="objectField.type === 'time'"
                  :name="`${name}[${i}].${objectField.name}`"
                  class="w-full"
                />
                <TextField v-else :name="`${name}[${i}].${objectField.name}`" class="w-full" />
              </div>
              <div class="flex w-20 items-start gap-1 pb-2">
                <Button
                  size="icon"
                  variant="muted"
                  @click="
                    () => {
                      remove(i)
                      emits('deleteRow', i)
                    }
                  "
                >
                  <Trash2Icon />
                </Button>
                <Button
                  size="icon"
                  variant="muted"
                  draggable="true"
                  class="cursor-grab active:cursor-grabbing"
                  @dragstart="handleDragStart(i)"
                  @dragend="handleDragEnd"
                >
                  <GripVerticalIcon />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FieldArray>
</template>

<style></style>
