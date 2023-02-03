<script lang="ts" setup>

definePageMeta({ middleware: ["auth"] })

const { params } = useRoute();
const { getById } = useMixtapesStore();

const id = params.id as string;
const { data } = await useAsyncData("mixtape", () => getById(id));
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
    title: "Durée",
    key: "duration",
    align: "end",
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
</script>

<template>
  <PageHeader v-on:back="handleBack" title="La mixtape en détails">
    <template #extra>
      <div class="flex items-center">
        <v-btn icon="mdi-pencil" class="mr-2" @click="navigateTo(`/mixtapes/edit/${id}`)"></v-btn>
      </div>
    </template>
  </PageHeader>
  <v-container class="n-page-content">
    <v-card>
      <div class="card-header">
        <div class="card-texts">
          <v-card-title class="mixtape-title">{{ mixtape.name }}</v-card-title>
          <v-card-subtitle> Mixée en {{ mixtape.year }} par {{ mixtape.created_by }}</v-card-subtitle>
          <v-card-subtitle v-if="mixtape.comment" class="mt-5">
            {{ mixtape.comment }}
          </v-card-subtitle>
        </div>
        <v-avatar class="mixtape-cover ma-3" size="250" rounded="0">
          <v-img :src="mixtape.cover_url"></v-img>
        </v-avatar>
      </div>
      <v-card-text>
        <span class="text-h6">Pistes</span>
        <v-data-table :headers="headers" :items="mixtape.tracks" items-per-page="-1" no-data-text="Aucune donnée." />
      </v-card-text>
    </v-card>
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
