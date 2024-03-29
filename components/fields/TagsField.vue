<script lang="ts">
export interface ItemBase {
  id?: number
  name?: string | null
  [key: string]: unknown
}
</script>
<script lang="ts" setup>
interface Data {
  tags: ItemBase[]
}
const props = defineProps<{
  modelValue: ItemBase[]
  label: string
  required?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: ItemBase[]): void
}>()

const { modelValue } = toRefs(props)
const { isLoading } = useLoadingStore()
const { fetchTags } = useTagsStore()
const { data: tagsData } = useTagsStoreRefs()
const tags = computed(() => tagsData.value.map(({ id, name }) => ({ id, name })))
const data: Data = reactive({
  tags: modelValue.value.map(({ id, name }) => ({ id, name })),
})

watch(
  () => data.tags,
  (value) => {
    emit(
      "update:modelValue",
      value.map((v) => (typeof v === "string" ? { name: v } : v))
    )
  }
)

onMounted(() => {
  fetchTags()
})
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-combobox
        v-model="data.tags"
        :hide-no-data="false"
        :loading="isLoading('tags')"
        :label="label"
        :items="tags"
        item-title="name"
        item-value="id"
        chips
        closable-chips
        multiple
        variant="outlined"
        :required="required"
        hide-selected
      >
        <template #no-data>
          <select-no-data data-type="Tag" />
        </template>
      </v-combobox>
    </v-col>
  </v-row>
</template>

<style scoped></style>
