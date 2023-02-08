<script lang="ts" setup>
import { MixtapeExt, MixtapeParamsExt, TrackParams } from '~~/types/supatypes';

const { mixtape } = defineProps<{
  mixtape?: MixtapeExt,
}>();

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit', value: MixtapeParamsExt): void
}>()

const { fetchAuthors } = useAuthorsStore()
const { fetchTags } = useTagsStore()
const { data: authorsData, isLoading: isLoadingAuthors } = storeToRefs(useAuthorsStore())
const { data: tagsData, isLoading: isLoadingTags } = storeToRefs(useTagsStore())
const valid = ref(false);
const years = generateYears(2007);
const authors = computed(() => authorsData.value.map(({ id, name }) => ({ id, name })));
const tags = computed(() => tagsData.value.map(({ id, name }) => ({ id, name })));
const isEdit = computed(() => !!mixtape);
const rules = {
  min2Char: (v: string) => v.length >= 2 || 'Doit comporter au moins 2 caractères',
  eq4Chars: (v: string) => v.length === 4 || 'Doit comporter 4 caractères'
};
const form = reactive({
  name: mixtape?.name ?? null,
  year: mixtape?.year ?? null,
  comment: mixtape?.comment ?? null,
  tracks_text: mixtape?.tracks_text ?? null,
  authors: mixtape?.authors ?? [],
  tags: mixtape?.tags ?? [],
  tracks: mixtape?.tracks ?? [],
  cover: mixtape?.cover ?? null,
  cover_url: mixtape?.cover_url ?? null,
  cover_file: {
    filename: mixtape?.cover ?? null,
    data: mixtape?.cover_url ?? null
  }
});
const emptyTrack: TrackParams = {
  title: null,
  artist: null,
  start_at: null
};

const handleRemoveTrack = (index: number) => form.tracks.splice(index, 1)

const handleCancel = () => emit("cancel")

const handleSubmit = () => emit("submit", form);

onMounted(() => {
  fetchAuthors();
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
              <v-combobox v-model="form.authors" :loading="isLoadingAuthors" label="DJ's" :items="authors"
                item-title="name" item-value="id" chips closable-chips multiple variant="outlined"
                required></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-select v-model="form.year" label="Année" :items="years" variant="outlined" required></v-select>
            </v-col>
            <v-col cols="12">
              <v-combobox v-model="form.tags" :loading="isLoadingTags" label="Tags" :items="tags" item-title="name"
                item-value="id" chips closable-chips multiple variant="outlined" required></v-combobox>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <image-field v-model="form.cover_file" label="Cover" :aspect-ratio="1.175" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <repeatable-field v-model:model-value="form.tracks" v-model:text-value="form.tracks_text" title="Pistes"
            :empty-item="emptyTrack" @remove="handleRemoveTrack" importable>
            <template #item="{ item, index }: { item: TrackParams, index: number }">
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
          </repeatable-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="form.comment" label="Commentaire" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="form-buttons">
            <v-btn variant="text" class="mr-2" @click="handleCancel">Annuler</v-btn>
            <v-btn variant="tonal" color="primary" @click="handleSubmit"> {{
              isEdit?" Mettre à jour": "Ajouter"
            }}</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
.info-alert {
  height: 100%;
  text-align: center;
}
</style>
