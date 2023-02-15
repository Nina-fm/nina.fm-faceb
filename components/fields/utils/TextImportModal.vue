<script lang="ts" setup>
interface Data {
  open: boolean;
  text: string | null;
}
const props = defineProps<{
  modelValue: string | null,
  openValue: boolean,
  alert?: string,
  label: string,
  cancelText?: string,
  importText?: string,
  multiline?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | null): void,
  (e: 'update:open-value', value: boolean): void,
  (e: 'cancel'): void,
  (e: 'import'): void,
}>()


const { openValue, modelValue } = toRefs(props)
const { multiline } = props
const data: Data = reactive({
  open: openValue.value,
  text: modelValue.value
})

watch(openValue, (value) => {
  data.open = value
})

watch(() => data.open, (value) => {
  emit('update:open-value', value)
})

watch(() => data.text, (value) => {
  emit('update:model-value', value)
})

const handleCancel = () => {
  data.open = false
  emit('cancel')
}

const handleImport = () => {
  data.open = false;
  emit('import');
}
</script>

<template>
  <v-dialog v-model="data.open">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" lg="8">
          <v-card>
            <v-toolbar color="primary">
              <v-card-title>Import • {{ label }}</v-card-title>
              <v-card-subtitle>Format text</v-card-subtitle>
            </v-toolbar>
            <v-card-text>
              <v-alert color="info" title="Attention au format !" icon="mdi-alert">
                <slot name="alert">{{ alert }}</slot>
              </v-alert>
            </v-card-text>
            <v-card-text>
              <v-textarea v-if="multiline" v-model="data.text" :label="`${label} (format text)`" :rows="10"
                @keydown.enter="handleImport" />
              <v-text-field v-else v-model="data.text" :label="`${label} (format text)`"
                @keydown.enter="handleImport" />
            </v-card-text>
            <v-card-actions>
              <v-btn variant="plain" @click="handleCancel">{{ cancelText ?? "Annuler" }}</v-btn>
              <v-btn variant="tonal" color="primary" @click="handleImport">{{ importText ?? "Importer" }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<style scoped>

</style>
