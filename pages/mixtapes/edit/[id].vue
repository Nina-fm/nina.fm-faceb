<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })

const { params } = useRoute();
const { updateMixtape, getById } = useMixtapesStore();

const id = params.id as string
const { data } = await useAsyncData("mixtape", () => getById(id));
const mixtape = computed(() => data.value);
const form = reactive({
  name: mixtape.value.name,
  year: mixtape.value.year,
  comment: mixtape.value.comment,
  tracks_text: mixtape.value.tracks_text,
  authors: mixtape.value.authors,
  tracks: mixtape.value.tracks,
  cover: mixtape.value.cover,
  cover_url: mixtape.value.cover_url,
  cover_file: {
    filename: null,
    data: null
  }
})

const handleCancel = () => {
  navigateTo("/mixtapes")
}

const handleSubmit = async () => {
  const { error } = await updateMixtape(id, form);
  if (!error) navigateTo("/mixtapes")
}
</script>

<template>
  <PageHeader @back="navigateTo('/mixtapes')" title="Modifier la mixtape" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <MixtapeForm v-model="form" edit @cancel="handleCancel" @submit="handleSubmit" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
