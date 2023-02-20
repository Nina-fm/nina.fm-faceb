<script lang="ts">
export interface ItemBase {
  id?: number;
  name?: string | null;
  [key: string]: unknown;
}
</script>
<script lang="ts" setup>
interface Data {
  text: string | null;
  authors: ItemBase[];
}
const props = defineProps<{
  modelValue: ItemBase[],
  textValue: string | null,
  label: string,
  required?: boolean,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ItemBase[]): void,
  (e: 'update:textValue', value: string | null): void,
}>();

const { parseAuthors } = useImport();
const { modelValue, textValue } = toRefs(props)
const { fetchAuthors } = useAuthorsStore()
const { data: authorsData, isLoading: isLoadingAuthors } = useAuthorsStoreRefs()
const openImport = ref(false);
const authors = computed(() => authorsData.value.map(({ id, name }) => ({ id, name })));
const data: Data = reactive({
  text: textValue.value ?? null,
  authors: modelValue.value.map(({ id, name }) => ({ id, name }))
})

watch(() => data.text, (value) => {
  emit('update:textValue', value)
})

watch(data.authors, (value) => {
  emit('update:modelValue', value)
})

const handleOpenImport = () => {
  openImport.value = true
}

const handleCancelImport = () => {
  openImport.value = false;
}

const handleImport = () => {
  openImport.value = false;
  data.authors.splice(0, data.authors.length, ...parseAuthors(data.text));
}

onMounted(() => {
  fetchAuthors();
})
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-combobox v-model="data.authors" :hide-no-data="false" :loading="isLoadingAuthors" :label="label" :items="authors"
        item-title="name" item-value="id" chips readonly multiple variant="outlined" :required="required"
        @click="handleOpenImport">
        <template v-slot:append-inner>
          <v-tooltip text="Importer au format texte" location="top">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-import" variant="plain" class="field-inner-button" @click.stop="handleOpenImport"
                v-bind="props" />
            </template>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <select-no-data data-type="DJ" />
        </template>
      </v-combobox>
    </v-col>
  </v-row>
  <text-import-modal v-model:open-value="openImport" v-model:model-value="data.text" :label="label"
  alert="Veuillez respecter le format saisi dans AirTime" @cancel="handleCancelImport" @import="handleImport" />
</template>

<style scoped></style>
