<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })

const { createMixtape } = useMixtapesStore();

const form = reactive({
  name: null,
  year: null,
  comment: null,
  tracks_text: null,
  authors: [],
  tracks: []
})

const handleCancel = () => {
  navigateTo("/mixtapes")
}

const handleSubmit = async () => {
  console.log({ form })
  const { error } = await createMixtape(form);
  if (!error) navigateTo("/mixtapes")
}
</script>

<template>
  <PageHeader @back="navigateTo('/mixtapes')" title="Nouvelle mixtape" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <MixtapeForm v-model="form" @cancel="handleCancel" @submit="handleSubmit" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
