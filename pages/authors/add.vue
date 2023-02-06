<script lang="ts" setup>
import { AuthorParamsExt } from '~~/types/supatypes';

definePageMeta({ middleware: ["auth"] })

const { createAuthor } = useAuthorsStore();

const handleCancel = () => {
  navigateTo("/authors")
}

const handleSubmit = async (form: AuthorParamsExt) => {
  const { error } = await createAuthor(form);
  if (!error) navigateTo("/authors")
}
</script>

<template>
  <PageHeader @back="navigateTo('/authors')" title="Nouveau DJ" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <AuthorForm @cancel="handleCancel" @submit="handleSubmit" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
