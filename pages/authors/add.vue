<script lang="ts" setup>
import { AuthorParamsExt } from "~~/types/supatypes"

definePageMeta({ middleware: ["auth"] })

const { createAuthor } = useAuthorsStore()

const handleCancel = () => {
  navigateTo("/authors")
}

const handleSubmitAndClose = async (form: AuthorParamsExt) => {
  const { error } = await createAuthor(form)
  if (!error) navigateTo("/authors")
}
</script>

<template>
  <PageHeader title="Nouveau DJ" @back="navigateTo('/authors')" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <AuthorForm @cancel="handleCancel" @submit-and-close="handleSubmitAndClose" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
