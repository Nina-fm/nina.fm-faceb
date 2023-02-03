<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })

const { createAuthor } = useAuthorsStore();

const form = reactive({
  name: '',
  user_id: null
})

const handleCancel = () => {
  navigateTo("/authors")
}

const handleSubmit = async () => {
  const { error } = await createAuthor(form);
  if (!error) navigateTo("/authors")
}
</script>

<template>
  <PageHeader @back="navigateTo('/authors')" title="Nouveau DJ" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-text>
        <AuthorForm v-model="form" edit @cancel="handleCancel" @submit="handleSubmit" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>
