<script lang="ts" setup>
import { MixtapeParamsExt, TrackParams } from '~~/types/supatypes';

const { modelValue, edit } = defineProps<{
  modelValue: MixtapeParamsExt,
  edit?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: MixtapeParamsExt): void
  (e: 'cancel'): void
  (e: 'submit', value: MixtapeParamsExt): void
}>()

const { fetchAuthors } = useAuthorsStore()
const { data, isLoading } = storeToRefs(useAuthorsStore())
const valid = ref(false)

const handleCancel = () => emit("cancel")
const handleSubmit = () => emit("submit", modelValue);

const rules = {
  min2Char: (v: string) => v.length >= 2 || 'Doit comporter au moins 2 caractères',
  eq4Chars: (v: string) => v.length === 4 || 'Doit comporter 4 caractères'
}

const authors = computed(() => data.value.map(({ id, name }) => ({ id, name })));
const tags = computed(() => [])
const years = generateYears(2007);
const emptyTrack = {
  title: null,
  artist: null,
  start_at: null
}

const handleAddTrack = () => {
  modelValue.tracks.push({ ...emptyTrack })
}

const handleRemoveTrack = (index: number) => {
  modelValue.tracks.splice(index, 1)
}

onMounted(() => fetchAuthors())
</script>

<template>
  <v-form v-model="valid" validate-on="blur">
    <v-container>
      <v-row>
        <v-col lg="7">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="modelValue.name" label="Nom" :rules="[rules.min2Char]" required />
            </v-col>
            <v-col cols="12">
              <v-combobox v-model="modelValue.authors" :loading="isLoading" label="DJ's" :items="authors"
                item-title="name" item-value="id" chips closable-chips multiple variant="outlined"
                required></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-select v-model="modelValue.year" label="Année" :items="years" variant="outlined" required></v-select>
            </v-col>
            <v-col cols="12">
              <v-combobox v-model="modelValue.tags" :loading="isLoading" label="Tags" :items="tags" item-title="name"
                item-value="id" chips closable-chips multiple variant="outlined"></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="modelValue.comment" label="Commentaire" required />
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <image-field v-model="modelValue.cover_file" label="Cover" :default-value="modelValue.cover_url" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <repeatable-field v-model="modelValue.tracks" title="Pistes" @add="handleAddTrack"
            @remove="handleRemoveTrack">
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
          <v-textarea v-model="modelValue.tracks_text" label="Pistes (format texte)" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="form-buttons">
            <v-btn class="mr-2" @click="handleCancel">Annuler</v-btn>
            <v-btn color="primary" @click="handleSubmit"> {{
              edit?" Mettre à jour": "Ajouter"
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
