<script lang="ts" setup>
import { MixtapeParams } from '~~/types/supatypes';

const { modelValue, edit } = defineProps<{
  modelValue: MixtapeParams,
  edit?: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: MixtapeParams): void
  (e: 'cancel'): void
  (e: 'submit', value: MixtapeParams): void
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
const years = generateYears()

onMounted(() => fetchAuthors())
</script>

<template>
  <v-form v-model="valid" @submit.prevent="handleSubmit" validate-on="blur">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="modelValue.name" label="Nom" :rules="[rules.min2Char]" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-combobox v-model="modelValue.authors" :loading="isLoading" label="DJ's" :items="authors" item-title="name"
            item-value="id" chips closable-chips multiple variant="outlined" required></v-combobox>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select v-model="modelValue.year" label="Année" :items="years" variant="outlined" required></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="modelValue.comment" label="Commentaire" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="modelValue.tracks_text" label="Pistes (format texte)" required />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="buttons">
            <v-btn class="mr-2" @click="handleCancel">Annuler</v-btn>
            <v-btn color="primary" type="submit">{{ edit? "Mettre à jour": "Ajouter" }}</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
.buttons {
  display: flex;
  justify-content: flex-end;
}
</style>
