<script lang="ts" setup>
import { MixtapeParamsExt } from "~~/types/supatypes"

definePageMeta({ middleware: ["auth"] })

const { createMixtape } = useMixtapesStore()

const handleCancel = () => {
  navigateTo("/mixtapes")
}

const handleSubmitAndClose = async (form: MixtapeParamsExt) => {
  const { error } = await createMixtape(form)
  if (!error) navigateTo("/mixtapes")
}
</script>

<template>
  <PageHeader title="Nouvelle mixtape" @back="navigateTo('/mixtapes')" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <MixtapeForm @cancel="handleCancel" @submit-and-close="handleSubmitAndClose" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
