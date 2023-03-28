<script lang="ts">
export interface Form {
  url?: string | null
}
</script>
<script lang="ts" setup>
import { MixtapeParamsExt } from "~~/types/supatypes"

const props = defineProps<{
  data?: MixtapeParamsExt[]
}>()
const emit = defineEmits<{
  (e: "cancel"): void
  (e: "analyze", value: Form): void
  (e: "import"): void
}>()

const { data } = toRefs(props)
const valid = ref(false)
const form: Form = reactive({
  url: null,
})

const handleCancel = () => emit("cancel")
const handleAnalyze = () => emit("analyze", form)
const handleImport = () => emit("import")
</script>

<template>
  <v-form v-if="!data?.length" v-model="valid" validate-on="blur" @submit.prevent>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="form.url" label="Url du fichier JSON" required @keydown.enter="handleAnalyze" />
        </v-col>
      </v-row>
    </v-container>
    <submit-buttons :disabled="!form.url" submit-text="Analyser" @cancel="handleCancel" @submit="handleAnalyze" />
  </v-form>
  <v-form v-else v-model="valid" @submit.prevent>
    <submit-buttons submit-text="Importer" @cancel="handleCancel" @submit="handleImport" />
  </v-form>
</template>

<style scoped></style>
