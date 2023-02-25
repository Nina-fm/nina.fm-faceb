<script lang="ts" setup>

definePageMeta({ middleware: ["auth"] })

const { params } = useRoute();
const { getById } = useMixtapesStore();
const { deleteMixtape } = useMixtapesStore()

const id = params.id as string;
const { data } = await useAsyncData("mixtape", () => getById(id));
const openConfirm = ref(false);
const mixtape = computed(() => data.value)
const headers = [
  {
    title: "Position",
    key: "position",
    sortable: false
  },
  {
    title: "Artiste",
    key: "artist",
    sortable: false
  },
  {
    title: "Titre",
    key: "title",
    sortable: false
  },
  {
    title: "Début",
    key: "start_at",
    align: "end",
    sortable: false
  }
]

const handleBack = () => {
  navigateTo("/mixtapes")
}

const handleDelete = () => {
  openConfirm.value = true;
}

const handleCloseConfirm = () => { openConfirm.value = false }

const handleConfirmDelete = async () => {
  const { error } = await deleteMixtape(id);
  if (!error) {
    navigateTo("/mixtapes")
  }
}
</script>

<template>
  <PageHeader v-on:back="handleBack" title="La mixtape en détails" :actions="[
    { tooltip: 'Modifier', icon: 'mdi-pencil', onClick: () => navigateTo(`/mixtapes/edit/${id}`) },
    { tooltip: 'Supprimer', icon: 'mdi-delete', onClick: handleDelete },
    { tooltip: 'Ajouter', icon: 'mdi-plus', onClick: () => navigateTo(`/mixtapes/add`) }
  ]" />
  <v-container class="n-page-content">
    <v-card>
      <div class="card-header">
        <div class="card-texts">
          <v-card-title class="mixtape-title">{{ mixtape.name }}</v-card-title>
          <v-card-subtitle> Mixée en {{ mixtape.year }} par {{ mixtape.authors_text }}</v-card-subtitle>
          <v-card-text>
            <v-chip v-for="tag in mixtape.tags" density="comfortable">{{ tag.name }}</v-chip>
          </v-card-text>
        </div>
        <v-avatar class="mixtape-cover ma-3" size="250" rounded="0">
          <v-img :src="mixtape.cover_url"></v-img>
        </v-avatar>
      </div>
      <v-card-text>
        <span class="text-h6">Pistes</span>
        <v-data-table :headers="headers" :items="mixtape.tracks" items-per-page="-1" no-data-text="Aucune donnée." />
      </v-card-text>
      <v-card-text v-if="mixtape.comment" class="mt-5">
        {{ mixtape.comment }}
      </v-card-text>
    </v-card>
    <Confirm v-model="openConfirm" @close="handleCloseConfirm" @confirm="handleConfirmDelete">
      <p>La mixtape sera supprimée définitivement.</p>
      <p>Confirmez-vous l'action ?</p>
    </Confirm>
  </v-container>
</template>

<style lang="scss" scoped>
:deep(.v-data-table-footer) {
  display: none
}

.card-header {
  display: flex;
  flex-direction: row;
}

.card-texts {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.mixtape-title {
  font-size: 2rem;
  margin-top: 0.2em;
}

.mixtape-cover {
  flex: 1;
  align-items: flex-end;
}

.mixtape-cover :deep(.v-img__img) {
  object-position: right;
}
</style>
