<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import Confirm from '~~/components/ui/Confirm.vue';

definePageMeta({ middleware: ["auth"] })

const { user } = storeToRefs(useAuthStore())
const { fetchAuthors, deleteAuthor } = useAuthorsStore()
const { data: authors } = storeToRefs(useAuthorsStore());
const itemsPerPage = ref(-1)
const search = ref(null);
const idToDelete = ref<string | number | null>(null)
const openConfirm = ref(false);
const headers = [
  {
    title: 'Nom',
    key: 'name',
  },
  {
    title: "User",
    key: "user_id"
  },
  {
    title: "Actions",
    key: "actions",
    align: "end"
  }
];

const isMe = (userId: string) => user.value?.id === userId

const handleRowClick = (event: Event, value: DataTableRow) => {
  navigateTo(`/authors/${value.item.raw.id}`)
}

const handleEdit = (event: Event, id: string | number) => {
  navigateTo(`/authors/edit/${id}`)
}

const handleDelete = (event: Event, id: string | number) => {
  idToDelete.value = id;
  openConfirm.value = true;
}

const handleCloseConfirm = () => { openConfirm.value = false }

const handleConfirmDelete = async () => {
  if (idToDelete.value) {
    const { error } = await deleteAuthor(idToDelete.value);
    if (!error) {
      await fetchAuthors();
    }
  }
}

const handleRefresh = async () => {
  await fetchAuthors();
}

onMounted(() => fetchAuthors())
</script>

<template>
  <PageHeader title="Les DJ's" :actions="[
    { icon: 'mdi-refresh', onClick: handleRefresh },
    { icon: 'mdi-plus', onClick: () => navigateTo('/authors/add') }
  ]">
    <template #content>
      <v-text-field v-model="search" variant="solo" density="compact" prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher..." single-line hide-details clearable />
    </template>
  </PageHeader>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :search="search"
          :items="authors.sort((a: any, b: any) => b.id - a.id)" class="clickable" @click:row="handleRowClick">
          <template v-slot:item.user_id="{ item }">
            <v-chip v-if="isMe(item.raw.user_id)" color="primary" size="small">Moi</v-chip>
            <v-badge v-else :class="`${item.raw.user_id ? '' : 'outlined'}`" dot inline
              :color="item.raw.user_id ? 'primary' : 'default'" />
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex flex-row justify-end">
              <v-btn icon="mdi-pencil" color="default" size="small" variant="text"
                @click.stop="(e: Event) => handleEdit(e, item.raw.id)" />
              <v-btn icon="mdi-delete" color="default" size="small" variant="text"
                @click.stop="(e: Event) => handleDelete(e, item.raw.id)" />
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <Confirm v-model="openConfirm" @close="handleCloseConfirm" @confirm="handleConfirmDelete">
      <p>Le DJ sera supprimé définitivement.</p>
      <p>Confirmez-vous l'action ?</p>
    </Confirm>
  </v-container>
</template>

<style scoped>
:deep(.v-data-table-footer) {
  display: none
}

:deep(.v-badge.outlined .v-badge__badge) {
  background-color: transparent;
  border: 1px solid currentColor;
}
</style>
