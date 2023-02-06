<script lang="ts" setup>
import { storeToRefs } from 'pinia';

definePageMeta({ middleware: ["auth"] })

const { fetchMixtapes, deleteMixtape } = useMixtapesStore()
const { data: mixtapes } = storeToRefs(useMixtapesStore());
const search = ref(null);
const itemsPerPage = ref(50)
const idToDelete = ref<string | number | null>(null)
const openConfirm = ref(false);
const headers = [
  {
    title: 'ID',
    key: 'id',
    width: 60
  },
  {
    title: 'Cover',
    key: 'cover',
    width: 60
  },
  {
    title: 'Mixtape',
    key: 'name',
  },
  {
    title: "Pistes",
    key: 'tracks',
    width: 60
  },
  {
    title: 'Année',
    key: 'year',
    width: 60
  },
  {
    title: 'Par',
    key: 'created_by',
  },
  {
    title: 'Tags',
    key: 'tags',
    width: 60
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'end',
    sortable: false
  }
];

const handleRowClick = (event: Event, value: DataTableRow) => {
  navigateTo(`/mixtapes/${value.item.raw.id}`)
}

const handleEdit = (event: Event, id: string | number) => {
  navigateTo(`/mixtapes/edit/${id}`)
}

const handleDelete = (event: Event, id: string | number) => {
  idToDelete.value = id;
  openConfirm.value = true;
}

const handleCloseConfirm = () => { openConfirm.value = false }

const handleConfirmDelete = async () => {
  if (idToDelete.value) {
    const { error } = await deleteMixtape(idToDelete.value);
    if (!error) {
      await fetchMixtapes();
    }
  }
}

const handleRefresh = async () => {
  await fetchMixtapes();
}

onMounted(() => fetchMixtapes())
</script>

<template>
  <PageHeader title="Les mixtapes">
    <template #content>
      <v-text-field v-model="search" variant="solo" density="compact" prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher..." single-line hide-details clearable />
    </template>
    <template #extra>
      <v-btn variant="text" icon="mdi-refresh" class="mr-2" @click="handleRefresh" />
      <v-btn variant="text" icon="mdi-plus" @click="navigateTo('/mixtapes/add')" />
    </template>
  </PageHeader>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="mixtapes" :search="search"
          class="clickable" @click:row="handleRowClick">
          <template v-slot:item.cover="{ item }">
            <v-avatar rounded color="grey-darken-3">
              <v-img v-if="item.raw.cover_url" :src="item.raw.cover_url" cover />
              <v-icon v-else icon="mdi-image-off" color="grey-darken-2" />
            </v-avatar>
          </template>
          <template v-slot:item.tracks="{ item }">
            <v-chip density="comfortable" :color="item.raw.tracks.length ? 'primary' : 'warning'">{{
              item.raw.tracks.length
            }}</v-chip>
          </template>
          <template v-slot:item.tags="{ item }">
            <v-tooltip location="bottom" content-class="bg-grey-darken-3">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" :color="!!item.raw.tags.length ? 'primary' : 'default'" density="comfortable">{{
                  item.raw.tags.length
                }}</v-chip>
              </template>
              <template v-slot:default>
                <v-chip v-for="tag in item.raw.tags" color="primary" variant="flat" size="small" density="comfortable"
                  class="mx-1">{{
                    tag.name
                  }}</v-chip>
              </template>
            </v-tooltip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-pencil" color="default" size="small" variant="text"
              @click.stop="(e: Event) => handleEdit(e, item.raw.id)" />
            <v-btn icon="mdi-delete" color="default" size="small" variant="text"
              @click.stop="(e: Event) => handleDelete(e, item.raw.id)" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <Confirm v-model="openConfirm" @close="handleCloseConfirm" @confirm="handleConfirmDelete">
      <p>La mixtape sera supprimée définitivement.</p>
      <p>Confirmez-vous l'action ?</p>
    </Confirm>
  </v-container>
</template>

<style scoped>

</style>
