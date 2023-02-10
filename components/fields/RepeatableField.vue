<script lang="ts">
export type ItemBase = {
  key?: string;
  position?: number;
  [key: string]: unknown;
};
</script>
<script lang="ts" setup>
import uniqid from 'uniqid'

const { modelValue, emptyItem, label, emptySuggestion, onClick } = defineProps<{
  emptyItem: ItemBase,
  modelValue: ItemBase[],
  label: string,
  emptySuggestion?: boolean,
  onClick?: (e: Event) => void,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ItemBase[]): void,
  (e: 'add'): void
  (e: 'remove', value: number): void
}>();

const active = ref(false);
const data = reactive(modelValue.map((el) => ({ ...el, key: uniqid() } as ItemBase)));

watch(modelValue, (value) => {
  data.splice(0, data.length, ...value.map((el) => ({ ...el, key: uniqid() } as ItemBase)))
})

watch(data, (value) => {
  const rows = value.map(({ key, ...row }) => ({ ...row }));
  emit('update:modelValue', rows)
})

onMounted(() => {
  if (!data.length && emptySuggestion) {
    handleAdd()
  }
})

const handleClear = () => {
  data.splice(0, data.length);
}

const handleAdd = () => {
  data.push({ ...emptyItem, key: uniqid(), position: data.length + 1 })
  emit('add')
}

const handleRemove = (index: number) => {
  emit('remove', index)
  data.splice(index, 1);
}

const handleChangePosition = (event: any) => {
  const { element, oldIndex, newIndex } = event.moved;
  data.splice(oldIndex, 1)
  data.splice(newIndex, 0, element)
  data.map((el, i) => ({ ...el, key: uniqid(), position: i + 1 }))
}
</script>

<template>
  <v-field class="repeatable-field" :label="label" :active="active" @click="onClick">
    <template v-slot:append-inner>
      <slot name="prepend-buttons" />
      <v-tooltip text="Ajouter une piste" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-plus" variant="plain" class="field-inner-button" @click.stop="handleAdd" v-bind="props" />
        </template>
      </v-tooltip>
      <v-tooltip text="Tout supprimer" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-playlist-remove" variant="plain" class="field-inner-button" @click.stop="handleClear"
            v-bind="props" />
        </template>
      </v-tooltip>
    </template>
    <div v-if="data.length" class="repeatable-field__content mt-15">
      <draggable :model-value="data" item-key="key" @change="handleChangePosition">
        <template #item="{ element, index }">
          <v-sheet>
            <div class="pt-0 pl-4 pb-4 d-flex">
              <div class="d-flex flex-grow-1">
                <slot name="item" :item="element" :index="index" />
              </div>
              <div class="d-flex pl-2">
                <v-tooltip text="Déplacer la piste" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-drag" size="small" variant="plain" v-bind="props" />
                  </template>
                </v-tooltip>
                <v-tooltip text="Supprimer la piste" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-delete" size="small" variant="plain" @click.stop="() => handleRemove(index)"
                      v-bind="props" />
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

  :deep(.v-field-label) {
    margin-top: 2px;
  }

  :deep(.v-field__append-inner) {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .repeatable-field__content {
    flex: 1;

    &> :deep(.v-sheet) {
      flex: 1;
    }
  }
}
</style>
