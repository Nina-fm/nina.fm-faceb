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

const { modelValue, textValue } = toRefs(props)
const { fetchAuthors } = useAuthorsStore()
const { data: authorsData, isLoading: isLoadingAuthors } = storeToRefs(useAuthorsStore())
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
  const authorNames = findAuthorNames(data.text ?? "");
  const newAuthors = authorNames.map((name) => {
    const author = authors.value.find((a) => a.name === name);
    return {
      name: author ? author.name : name,
      ...(author ? { id: author.id } : {})
    };
  })
  data.authors.splice(0, data.authors.length, ...newAuthors);
}

onMounted(() => {
  fetchAuthors();
})
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-combobox v-model="data.authors" :hide-no-data="false" :loading="isLoadingAuthors" :label="label"
        :items="authors" item-title="name" item-value="id" chips closable-chips multiple variant="outlined"
        :required="required">
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

<style scoped>

</style>
