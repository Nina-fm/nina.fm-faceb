<script lang="ts" setup>
import { MixtapeExt, MixtapeParamsExt } from "~~/types/supatypes"

const props = defineProps<{
  mixtape?: MixtapeExt
  onSubmit?: () => void
  onSubmitAndClose?: () => void
}>()

const emit = defineEmits<{
  (e: "cancel"): void
  (e: "submit", value: MixtapeParamsExt): void
  (e: "submit-and-close", value: MixtapeParamsExt): void
}>()

const { mixtape } = toRefs(props)
const { fetchTags } = useTagsStore()
const rules = useFieldRules()
const valid = ref(false)
const years = generateYearsSince(2007)
const isEdit = computed(() => !!mixtape.value)
const form: MixtapeParamsExt = reactive({
  name: mixtape.value?.name ?? null,
  year: mixtape.value?.year ?? null,
  comment: mixtape.value?.comment ?? null,
  authors_text: mixtape.value?.authors_text ?? null,
  authors: mixtape.value?.authors ?? [],
  tracks_text: mixtape.value?.tracks_text ?? null,
  tracks: mixtape.value?.tracks ?? [],
  tags: mixtape.value?.tags ?? [],
  cover: mixtape.value?.cover ?? null,
  cover_url: mixtape.value?.cover_url ?? null,
  cover_file: {
    filename: mixtape.value?.cover ?? null,
    data: mixtape.value?.cover_url ?? null,
  },
})

const handleCancel = () => emit("cancel")

const handleSubmit = () => emit("submit", form)

const handleSubmitAndClose = () => emit("submit-and-close", form)

onMounted(() => {
  fetchTags()
})

const hint = "Attention à bien respecter le format AirTime !"
</script>

<template>
  <v-form v-model="valid" validate-on="blur">
    <v-container>
      <v-row>
        <v-col cols="12" sm="7" lg="8">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.name" label="Nom" :rules="[rules.min2Char]" :hint="hint" required />
            </v-col>
            <v-col cols="12">
              <authors-field
                v-model:model-value="form.authors"
                v-model:text-value="form.authors_text"
                label="DJ's"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete v-model="form.year" label="Année" :items="years" variant="outlined" required />
            </v-col>
            <v-col cols="12">
              <tags-field v-model="form.tags" label="Tags" />
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <image-field v-model="form.cover_file" label="Cover" :aspect-ratio="1.175" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <tracks-field v-model:model-value="form.tracks" v-model:text-value="form.tracks_text" label="Pistes" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="form.comment" label="Commentaire" required />
        </v-col>
      </v-row>
    </v-container>
    <submit-buttons
      :edit="isEdit"
      v-bind="{
        ...(props?.onSubmit ? { onSubmit: handleSubmit } : {}),
        ...(props?.onSubmitAndClose ? { onSubmitAndClose: handleSubmitAndClose } : {}),
      }"
      @cancel="handleCancel"
    />
  </v-form>
</template>

<style scoped>
.info-alert {
  height: 100%;
  text-align: center;
}
</style>
