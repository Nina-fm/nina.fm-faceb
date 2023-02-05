<script lang="ts" setup>
import { MixtapeParamsExt } from '~~/types/supatypes';

definePageMeta({ middleware: ["auth"] })

const { createMixtape } = useMixtapesStore();

const handleCancel = () => {
  navigateTo("/mixtapes")
}

const handleSubmit = async (form: MixtapeParamsExt) => {
  const { error } = await createMixtape(form);
  if (!error) navigateTo("/mixtapes")
}
</script>

<template>
  <PageHeader @back="navigateTo('/mixtapes')" title="Nouvelle mixtape" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <MixtapeForm @cancel="handleCancel" @submit="handleSubmit" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
