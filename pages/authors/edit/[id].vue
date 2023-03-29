<script lang="ts" setup>
import { AuthorParamsExt } from "~~/types/supatypes"

definePageMeta({ middleware: ["auth"] })

const { params } = useRoute()
const { updateAuthor, getById } = useAuthorsStore()

const id = params.id as string
const { data } = await useAsyncData("author", () => getById(id))
const author = computed(() => data.value)

const handleCancel = () => {
  navigateTo("/authors")
}

const handleSubmit = async (form: AuthorParamsExt) => {
  const { error } = await updateAuthor(id, form)
}

const handleSubmitAndClose = async (form: AuthorParamsExt) => {
  const { error } = await updateAuthor(id, form)
  if (!error) navigateTo(`/authors`)
}
</script>

<template>
  <PageHeader title="Modifier le DJ" @back="navigateTo('/authors')" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <AuthorForm
          :author="author"
          edit
          @cancel="handleCancel"
          @submit="handleSubmit"
          @submit-and-close="handleSubmitAndClose"
        />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
