<script lang="ts" setup>
import uniqid from 'uniqid'

type ItemBase = {
  key?: string;
  position?: number;
  [key: string]: unknown;
}

const { modelValue, emptyItem } = defineProps<{
  emptyItem: ItemBase,
  modelValue: ItemBase[],
  title: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ItemBase[]): void,
  (e: 'add'): void
  (e: 'remove', value: number): void
}>();

const data = reactive(modelValue.map((el) => ({ ...el, key: uniqid() })));

watch(data, (value) => {
  emit('update:modelValue', value)
})

onMounted(() => {
  if (!data.length) {
    emit("add");
  }
})

const handleAdd = () => {
  emit('add')
  data.push({ ...emptyItem, key: uniqid(), position: data.length + 1 })
}

const handleChangePosition = (event: any) => {
  const { element, oldIndex, newIndex } = event.moved;
  data.splice(oldIndex, 1)
  data.splice(newIndex, 0, element)
  data.map((el, i) => ({ ...el, key: uniqid(), position: i + 1 }))
}
</script>

<template>
  <v-field class="repeatable-field" :label="title" append-inner-icon="mdi-plus" @click:appendInner="handleAdd">
    <div class="repeatable-field__content mt-15">
      <draggable :model-value="data" item-key="key" @change="handleChangePosition">
        <template #item="{ element, index }">
          <v-sheet>
            <div class="pt-0 pl-4 pb-4 d-flex">
              <div class="d-flex flex-grow-1">
                <slot name="item" :item="element" :index="index" />
              </div>
              <div class="d-flex pl-2">
                <v-btn icon="mdi-drag" size="small" variant="plain" />
                <v-btn icon="mdi-delete" size="small" variant="plain" @click="$emit('remove', index)" />
              </div>
            </div>
          </v-sheet>
        </template>
      </draggable>
    </div>
  </v-field>

</template>

<style lang="scss" scoped>
.repeatable-field {
  min-height: var(--v-input-control-height, 56px);

  :deep(.v-card-text) {
    padding: 5px;
  }

  :deep(.v-field__append-inner) {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .add-button {
    position: absolute;
    top: 5px;
    right: 10px;
  }

  .repeatable-field__content {
    flex: 1;

    &> :deep(.v-sheet) {
      flex: 1;
    }
  }
}
</style>
