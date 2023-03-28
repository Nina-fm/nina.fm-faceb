<script lang="ts" setup>
import { ItemBase } from "./RepeatableField.vue"

type Data = {
  text: string | null
  model: ItemBase[]
}

const props = defineProps<{
  modelValue: ItemBase[]
  textValue: string | null
  label: string
}>()

const emit = defineEmits<{
  (e: "update:model-value", value: ItemBase[]): void
  (e: "update:text-value", value: string | null): void
}>()

const { parseTracksText } = useImport({ init: false })
const { label, modelValue, textValue } = toRefs(props)
const openImport = ref(false)
const data: Data = reactive({
  text: textValue.value,
  model: modelValue.value,
})
const emptyTrack: ItemBase = {
  title: null,
  artist: null,
  start_at: null,
}

watch(
  () => data.text,
  (value) => {
    emit("update:text-value", value)
  }
)

watch(
  () => [...data.model],
  (value) => {
    emit("update:model-value", value)
  }
)

const handleOpenImport = () => {
  openImport.value = true
}

const handleCancelImport = () => {
  data.text = textValue.value
  openImport.value = false
}

const handleImport = () => {
  const parsedTracks = parseTracksText(data.text)
  modelValue.value.splice(0, modelValue.value.length, ...(parsedTracks as ItemBase[]))
  openImport.value = false
}

const handleClick = () => {
  if (!modelValue.value.length) {
    handleOpenImport()
  }
}
</script>

<template>
  <repeatable-field v-model="data.model" :label="label" :empty-item="emptyTrack" @click="handleClick">
    <template #prepend-buttons>
      <v-tooltip text="Importer au format texte" location="top">
        <template #activator="{ props: activatorProps }">
          <v-btn
            icon="mdi-import"
            variant="plain"
            class="field-inner-button"
            v-bind="activatorProps"
            @click.stop="handleOpenImport"
          />
        </template>
      </v-tooltip>
    </template>
    <template #item="{ item }">
      <v-row>
        <v-col>
          <v-text-field
            :model-value="item.artist"
            variant="underlined"
            label="Artiste"
            density="compact"
            required
            @change="(e: any) => item.artist = e.target.value"
          />
        </v-col>
        <v-col>
          <v-text-field
            :model-value="item.title"
            variant="underlined"
            label="Titre"
            density="compact"
            required
            @change="(e: any) => item.title = e.target.value"
          />
        </v-col>
        <v-col cols="3" lg="2">
          <v-text-field
            :model-value="item.start_at"
            variant="underlined"
            label="Début"
            density="compact"
            type="time"
            step="1"
            min="00:00:00"
            max="20:00:00"
            @change="(e: any) => item.start_at = e.target.value"
          />
        </v-col>
      </v-row>
    </template>
    <template #append-outer>
      <text-import-modal
        v-model="data.text"
        v-model:open-value="openImport"
        :label="label"
        multiline
        @cancel="handleCancelImport"
        @import="handleImport"
      >
        <template #alert>
          Veuillez respecter une ligne par piste, au format :
          <pre>01 Nom de l'artiste : Titre de la piste</pre>
        </template>
      </text-import-modal>
    </template>
  </repeatable-field>
</template>

<style lang="scss" scoped></style>
