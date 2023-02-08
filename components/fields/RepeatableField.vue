<script lang="ts" setup>
import uniqid from 'uniqid'
import { TrackParams } from '~~/types/supatypes';

type ItemBase = {
  key?: string;
  position?: number;
  [key: string]: unknown;
}

const { modelValue, textValue, emptyItem, importable } = defineProps<{
  emptyItem: ItemBase,
  modelValue: ItemBase[],
  textValue: string | null,
  title: string,
  importable?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ItemBase[]): void,
  (e: 'update:textValue', value: string | null): void,
  (e: 'add'): void
  (e: 'remove', value: number): void
}>();

const active = ref(false);
const importTracksOpen = ref(false);
const loadingImport = ref(false);
const loadingDeletion = ref(false);
const text = ref<string | null>(textValue);
const data = reactive(modelValue.map((el) => ({ ...el, key: uniqid() } as ItemBase)));

watch(data, (value) => {
  const tracks = value.map(({ key, ...track }) => ({ ...track }));
  emit('update:modelValue', tracks)
})

watch(text, (value) => {
  emit('update:textValue', value)
})

onMounted(() => {
  if (!data.length) {
    emit("add");
  }
})

const handleCancelTracksImport = () => {
  text.value = null;
  importTracksOpen.value = false;
}

const handleTracksImport = () => {
  importTracksOpen.value = false;
  loadingImport.value = true;
  const lines: string[] = text.value?.split(/\r?\n/) ?? [];
  const newLines: ItemBase[] = lines.map((line) => {
    const infos = /(\d+)\s(.*)\s:\s(.*)/g.exec(line);
    return {
      key: uniqid(),
      position: Number(infos?.[1]),
      artist: infos?.[2],
      title: infos?.[3]
    };
  });
  data.splice(0, data.length, ...newLines);
  loadingImport.value = false;
}

const handleOpenImport = () => {
  importTracksOpen.value = true
}

const handleClear = () => {
  loadingDeletion.value = true;
  text.value = null;
  data.splice(0, data.length);
  loadingDeletion.value = false;
}

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
  <v-field class="repeatable-field" :label="title" :active="active">
    <template v-slot:append-inner>
      <v-tooltip text="Importer les pistes au format texte" location="top">
        <template v-slot:activator="{ props }">
          <v-btn v-if="importable" icon="mdi-text-box-multiple-outline" variant="plain" class="field-button"
            :loading="loadingImport" :disabled="loadingImport" @click="handleOpenImport" v-bind="props" />
        </template>
      </v-tooltip>
      <v-tooltip text="Ajouter une piste" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-plus" variant="plain" class="field-button" @click="handleAdd" v-bind="props" />
        </template>
      </v-tooltip>
      <v-tooltip text="Supprimer toutes les pistes" location="top">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-playlist-remove" variant="plain" class="field-button" @click="handleClear" v-bind="props"
            :loading="loadingDeletion" :disabled="loadingDeletion" />
        </template>
      </v-tooltip>
    </template>
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
  <v-dialog v-model="importTracksOpen">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="8">
          <v-card>
            <v-toolbar color="primary">
              <v-card-title>Import des pistes</v-card-title>
              <v-card-subtitle>Format text</v-card-subtitle>
            </v-toolbar>
            <v-card-text>
              <v-alert color="info" title="Attention au format !">
                Veuillez respecter une ligne par piste, au format :
                <pre>01 Nom de l'artiste : Titre de la piste</pre>
              </v-alert>
            </v-card-text>
            <v-card-text>
              <v-textarea v-model="text" label="Pistes (format texte)" required :rows="10" />
            </v-card-text>
            <v-card-actions>
              <v-btn variant="text" @click="handleCancelTracksImport">Annuler</v-btn>
              <v-btn variant="tonal" color="primary" @click="handleTracksImport">Importer</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
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

  .field-button {
    margin-top: -4px;
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
