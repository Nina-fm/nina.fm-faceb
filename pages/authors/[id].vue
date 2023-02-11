<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })

const { params } = useRoute();
const { getById } = useAuthorsStore();
const { deleteMixtape } = useMixtapesStore()

const id = params.id as string;
const { data } = await useAsyncData("author", () => getById(id));
const openConfirm = ref(false);
const author = computed(() => data.value)

const handleDelete = () => {
  openConfirm.value = true;
}

const handleCloseConfirm = () => { openConfirm.value = false }

const handleConfirmDelete = async () => {
  const { error } = await deleteMixtape(id);
  if (!error) {
    navigateTo("/authors")
  }
}
</script>

<template>
  <PageHeader @back="navigateTo('/authors')" title="Le DJ en détails" :actions="[
    { icon: 'mdi-pencil', onClick: () => navigateTo(`/authors/edit/${id}`) },
    { tooltip: 'Supprimer', icon: 'mdi-delete', onClick: handleDelete }
    { tooltip: 'Ajouter', icon: 'mdi-plus', onClick: () => navigateTo(`/authors/add`) }
  ]" />
  <v-container class="n-page-content">
    <v-card>
      <v-card-title>{{ author?.name }}</v-card-title>
      <v-card-subtitle>Admin : {{ author?.user_id || "aucun" }}</v-card-subtitle>
      <v-card-text>
      </v-card-text>
    </v-card>
    <Confirm v-model="openConfirm" @close="handleCloseConfirm" @confirm="handleConfirmDelete">
      <p>Le DJ sera supprimé définitivement.</p>
      <p>Confirmez-vous l'action ?</p>
    </Confirm>
  </v-container>
</template>

<style scoped>

</style>