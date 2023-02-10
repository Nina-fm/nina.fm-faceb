<script lang="ts" setup>
import { MixtapeParamsExt } from '~~/types/supatypes';

definePageMeta({ middleware: ["auth"] })

const { params } = useRoute();
const { updateMixtape, getById } = useMixtapesStore();
const id = params.id as string
const { data } = await useAsyncData("mixtape", () => getById(id));
const mixtape = computed(() => data.value);

const handleCancel = () => {
  navigateTo("/mixtapes")
}

const handleSubmit = async (form: MixtapeParamsExt) => {
  const { error } = await updateMixtape(id, form);
  if (!error) navigateTo("/mixtapes")
}
</script>

<template>
  <PageHeader @back="navigateTo('/mixtapes')" title="Modifier la mixtape" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <MixtapeForm :mixtape="mixtape" @cancel="handleCancel" @submit="handleSubmit" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
