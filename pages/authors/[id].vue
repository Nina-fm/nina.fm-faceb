<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })

const { params } = useRoute();
const { getById } = useAuthorsStore();

const id = params.id as string;
const { data } = await useAsyncData("author", () => getById(id));
const author = computed(() => data.value)

</script>

<template>
  <PageHeader @back="navigateTo('/authors')" title="Le DJ en détails">
    <template #extra>
      <div class="flex items-center">
        <v-btn icon="mdi-pencil" class="mr-2" @click="navigateTo(`/authors/edit/${id}`)"></v-btn>
        <v-btn icon="mdi-plus" @click="navigateTo('/authors/add')"></v-btn>
      </div>
    </template>
  </PageHeader>
  <v-container class="n-page-content">
    <v-card>
      <v-card-title>{{ author?.name }}</v-card-title>
      <v-card-subtitle>Admin : {{ author?.user_id || "aucun" }}</v-card-subtitle>
      <v-card-text>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>

</style>