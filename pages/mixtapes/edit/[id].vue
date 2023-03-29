<script lang="ts" setup>
import { MixtapeParamsExt } from "~~/types/supatypes"

definePageMeta({ middleware: ["auth"] })

const { params } = useRoute()
const { updateMixtape, getById } = useMixtapesStore()
const id = params.id as string
const { data } = await useAsyncData("mixtape", () => getById(id))
const mixtape = computed(() => data.value)

const handleCancel = () => {
  navigateTo("/mixtapes")
}

const handleSubmit = async (form: MixtapeParamsExt) => {
  const { error } = await updateMixtape(id, form)
}

const handleSubmitAndClose = async (form: MixtapeParamsExt) => {
  const { error } = await updateMixtape(id, form)
  if (!error) navigateTo("/mixtapes")
}
</script>

<template>
  <PageHeader title="Modifier la mixtape" @back="navigateTo('/mixtapes')" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <MixtapeForm
          :mixtape="mixtape"
          @cancel="handleCancel"
          @submit="handleSubmit"
          @submit-and-close="handleSubmitAndClose"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
