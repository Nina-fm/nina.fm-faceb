<script lang="ts">
export interface ItemBase {
  id?: number
  name?: string | null
  [key: string]: unknown
}
</script>
<script lang="ts" setup>
import { formatAuthorNames } from "~~/utils/formatAuthors"

interface Data {
  text: string | null
  authors: ItemBase[]
}
const props = defineProps<{
  modelValue: ItemBase[]
  textValue: string | null
  label: string
  required?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: ItemBase[]): void
  (e: "update:textValue", value: string | null): void
}>()

const { parseAuthors } = useImport()
const { modelValue, textValue } = toRefs(props)
const { isLoading } = useLoadingStore()
const { fetchAuthors } = useAuthorsStore()
const { data: authorsData } = useAuthorsStoreRefs()
const openImport = ref(false)
const authors = computed(() => authorsData.value.map(({ id, name }) => ({ id, name })))
const data: Data = reactive({
  text: textValue.value ?? null,
  authors: modelValue.value.map(({ id, name }) => ({ id, name })),
})

watch(
  () => data.text,
  (value) => {
    emit("update:textValue", value)
  }
)

watch(
  () => [...data.authors],
  (value) => {
    emit("update:modelValue", value)
  }
)

const handleUpdateModelValue = (value: unknown) => {
  data.authors = (value as Array<ItemBase | string>).map((item) =>
    typeof item !== "string" ? { ...item } : authors.value.find((a) => a.name === item) || { name: item }
  )
  data.text = Array.isArray(value) ? formatAuthorNames(value as ItemBase[]) : ""
}

const handleOpenImport = () => {
  openImport.value = true
}

const handleCancelImport = () => {
  openImport.value = false
}

const handleImport = () => {
  openImport.value = false
  const items = parseAuthors(data.text)
  const parsed = items.map((item) => authors.value.find((a) => a.name === item.name) || item)
  data.authors.splice(0, data.authors.length, ...parsed)
}

const handleCompareValues = (a: ItemBase, b: ItemBase | string) =>
  a.name === (typeof b !== "string" && b?.name ? b.name : b)

onBeforeMount(() => {
  fetchAuthors()
})
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-combobox
        v-model="data.authors"
        :hide-no-data="false"
        :loading="isLoading('authors')"
        :label="label"
        :items="authors"
        item-title="name"
        item-value="id"
        chips
        closable-chips
        multiple
        variant="outlined"
        :value-comparator="handleCompareValues"
        @update:model-value="handleUpdateModelValue"
      >
        <template #append-inner>
          <v-tooltip text="Importer au format texte" location="top">
            <template #activator="{ props: activatorProps }">
              <v-btn icon="mdi-import" variant="plain" v-bind="activatorProps" @click.stop="handleOpenImport" />
            </template>
          </v-tooltip>
        </template>
        <template #no-data>
          <select-no-data data-type="DJ" />
        </template>
      </v-combobox>
    </v-col>
  </v-row>
  <text-import-modal
    v-model:open-value="openImport"
    v-model:model-value="data.text"
    :label="label"
    alert="Veuillez respecter le format saisi dans AirTime"
    @cancel="handleCancelImport"
    @import="handleImport"
  />
</template>

<style scoped></style>
