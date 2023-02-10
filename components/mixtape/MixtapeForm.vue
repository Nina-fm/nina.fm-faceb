<script lang="ts" setup>
import { MixtapeExt, MixtapeParamsExt, TrackParams } from '~~/types/supatypes';

const props = defineProps<{
  mixtape?: MixtapeExt,
}>();

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit', value: MixtapeParamsExt): void
}>()

const { mixtape } = props;
const { fetchTags } = useTagsStore()
const rules = useFieldRules()
const valid = ref(false);
const years = generateYears(2007);
const isEdit = computed(() => !!mixtape);
const form: MixtapeParamsExt = reactive({
  name: mixtape?.name ?? null,
  year: mixtape?.year ?? null,
  comment: mixtape?.comment ?? null,
  authors_text: mixtape?.authors_text ?? null,
  authors: mixtape?.authors ?? [],
  tracks_text: mixtape?.tracks_text ?? null,
  tracks: mixtape?.tracks ?? [],
  tags: mixtape?.tags ?? [],
  cover: mixtape?.cover ?? null,
  cover_url: mixtape?.cover_url ?? null,
  cover_file: {
    filename: mixtape?.cover ?? null,
    data: mixtape?.cover_url ?? null
  }
});

const handleCancel = () => emit("cancel")

const handleSubmit = () => emit("submit", form);

onMounted(() => {
  fetchTags();
})
</script>

<template>
  <v-form v-model="valid" validate-on="blur">
    <v-container>
      <v-row>
        <v-col cols="12" sm="7" lg="8">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.name" label="Nom" :rules="[rules.min2Char]" required />
            </v-col>
            <v-col cols="12">
              <authors-field v-model:model-value="form.authors" v-model:text-value="form.authors_text" label="DJ's"
                required />
            </v-col>
            <v-col cols="12">
              <v-autocomplete v-model="form.year" label="Année" :items="years" variant="outlined"
                required></v-autocomplete>
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
          <tracks-field v-model:model-value="form.tracks" v-model:text-value="form.tracks_text" label="Pistes">
            <template #item="{ item }: { item: TrackParams }">
              <v-row>
                <v-col>
                  <v-text-field variant="underlined" v-model="item.artist" label="Artiste" density="compact" required />
                </v-col>
                <v-col>
                  <v-text-field variant="underlined" v-model="item.title" label="Titre" density="compact" required />
                </v-col>
                <v-col cols="3" lg="2">
                  <v-text-field variant="underlined" v-model="item.start_at" label="Début" density="compact" type="time"
                    step='1' min="00:00:00" max="20:00:00" />
                </v-col>
              </v-row>
            </template>
          </tracks-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="form.comment" label="Commentaire" required />
        </v-col>
      </v-row>
    </v-container>
    <submit-buttons :edit="isEdit" @cancel="handleCancel" @submit="handleSubmit" />
  </v-form>
</template>

<style scoped>
.info-alert {
  height: 100%;
  text-align: center;
}
</style>
