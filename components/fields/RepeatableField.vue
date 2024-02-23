<script lang="ts">
export interface ItemBase {
  key?: string
  position?: number
  [key: string]: unknown
}
</script>
<script lang="ts" setup>
type Data = ItemBase[]

const props = defineProps<{
  modelValue: ItemBase[]
  emptyItem: ItemBase
  label: string
  emptySuggestion?: boolean
  onClick?: (e: Event) => void
}>()

const emit = defineEmits<{
  (e: "update:model-value", value: ItemBase[]): void
  (e: "add"): void
  (e: "remove", index: number): void
  (e: "clear"): void
}>()

const { modelValue } = toRefs(props)
const active = ref(false)
const updateLock = ref(false)
const data: Data = reactive(modelValue.value.map((el) => ({ ...el, key: uniqid() } as ItemBase)))

watch(
  () => [...modelValue.value],
  (value) => {
    updateLock.value = true
    data.splice(0, data.length, ...value.map((el) => ({ ...el, key: uniqid() } as ItemBase)))
  }
)

watch(
  () => [...data],
  (value) => {
    if (!updateLock.value) {
      const rows = value.map(({ key, ...row }) => ({ ...row }))
      emit("update:model-value", rows)
    }
    updateLock.value = false
  },
  { deep: true }
)

onMounted(() => {
  if (!data.length && props.emptySuggestion) {
    handleAdd()
  }
})

const handleClear = () => {
  data.splice(0, data.length)
  emit("clear")
}

const handleAdd = () => {
  data.push({ ...props.emptyItem, key: uniqid(), position: data.length + 1 })
  emit("add")
}

const handleRemove = (index: number) => {
  data.splice(index, 1)
  emit("remove", index)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleUpdate = (event: any) => {
  const { element, oldIndex, newIndex } = event.moved
  const temp = [...data]
  temp.splice(oldIndex, 1)
  temp.splice(newIndex, 0, element)
  data.splice(0, data.length, ...temp.map((el, i) => ({ ...el, key: uniqid(), position: i + 1 })))
}
</script>

<template>
  <v-field class="repeatable-field" :label="props.label" :active="active">
    <div class="repeatable-field__click-area" @click="props.onClick" />
    <template #append-inner>
      <slot name="prepend-buttons" />
      <v-tooltip text="Ajouter une piste" location="top">
        <template #activator="{ props: activatorProps }">
          <v-btn icon="mdi-plus" variant="plain" v-bind="activatorProps" @click.stop="handleAdd" />
        </template>
      </v-tooltip>
      <v-tooltip text="Tout supprimer" location="top">
        <template #activator="{ props: activatorProps }">
          <v-btn icon="mdi-playlist-remove" variant="plain" v-bind="activatorProps" @click.stop="handleClear" />
        </template>
      </v-tooltip>
    </template>
    <div v-if="data.length" class="repeatable-field__content mt-15">
      <draggable :list="data" item-key="key" @end="handleUpdate">
        <template #item="{ element, index }">
          <v-sheet :key="`repeatable-track-${index}`">
            <div class="pt-0 pl-4 pb-4 d-flex">
              <div class="d-flex flex-grow-1">
                <slot name="item" :item="element" :index="index" />
              </div>
              <div class="d-flex pl-2">
                <v-tooltip text="Déplacer la piste" location="top">
                  <template #activator="{ props: activatorProps }">
                    <v-btn icon="mdi-drag" size="small" variant="plain" v-bind="activatorProps" />
                  </template>
                </v-tooltip>
                <v-tooltip text="Supprimer la piste" location="top">
                  <template #activator="{ props: activatorProps }">
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="plain"
                      v-bind="activatorProps"
                      @click.stop="() => handleRemove(index)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-sheet>
        </template>
      </draggable>
    </div>
  </v-field>
  <slot name="append-outer" />
</template>

<style lang="scss" scoped>
.repeatable-field {
  --v-input-padding-top: 16px;
  min-height: var(--v-input-control-height, 56px);

  :deep(.v-card-text) {
    padding: 5px;
  }

  :deep(> .v-field__field > .v-field-label) {
    top: 8px;
    transform: translateY(50%);
  }

  :deep(.v-field__append-inner) {
    position: absolute;
    top: 3px;
    right: 0px;
  }

  .repeatable-field__click-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--v-input-control-height, 56px);
  }

  .repeatable-field__content {
    flex: 1;

    & > :deep(.v-sheet) {
      flex: 1;
    }
  }
}
</style>
