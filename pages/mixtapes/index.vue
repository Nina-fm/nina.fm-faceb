<script lang="ts" setup>
import { storeToRefs } from 'pinia';

definePageMeta({ middleware: ["auth"] })

const { fetchMixtapes, deleteMixtape } = useMixtapesStore()
const { data: mixtapes } = storeToRefs(useMixtapesStore());
const itemsPerPage = ref(50)
const idToDelete = ref<string | number | null>(null)
const openConfirm = ref(false);
const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Mixtape',
    key: 'name',
  },
  {
    title: 'Par',
    key: "created_by",
  },
  {
    title: 'Année',
    key: 'year',
  },
  {
    title: "Actions",
    key: "actions",
    align: "end"
  }
];

const handleRowClick = (event: Event, value: DataTableRow) => {
  console.log("handleRowClick", { event, value })
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
    <template #extra>
      <v-btn icon="mdi-refresh" class="mr-2" @click="handleRefresh" />
      <v-btn icon="mdi-plus" @click="navigateTo('/mixtapes/add')" />
    </template>
  </PageHeader>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="mixtapes"
          class="elevation-1 clickable" @click:row="handleRowClick" no-data-text="Aucune donnée.">
          <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-pencil" color="default" size="small" variant="text"
              @click.stop="(e: Event) => handleEdit(e, item.raw.id)" />
            <v-btn icon="mdi-delete" color="default" size="small" variant="text"
              @click="(e: Event) => handleDelete(e, item.raw.id)" />
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
