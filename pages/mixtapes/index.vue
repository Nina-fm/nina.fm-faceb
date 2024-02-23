<script lang="ts" setup>
import { useDisplay } from "vuetify/lib/framework.mjs"

definePageMeta({ middleware: ["auth"] })

const { fetchMixtapes, deleteMixtape, resetTagFilters } = useMixtapesStore()
const { filteredData: filteredMixtapes, tagFilters, search, itemsPerPage, page } = useMixtapesStoreRefs()
const { fetchTags } = useTagsStore()
const { data: tags } = useTagsStoreRefs()
const idToDelete = ref<string | number | null>(null)
const openConfirm = ref(false)
const { smAndUp, mdAndUp, update } = useDisplay()
const headersDefinition = [
  {
    title: "Mixtape",
    key: "name",
  },
  {
    title: "Pistes",
    key: "tracks",
    width: 60,
    show: "mdAndUp",
  },
  {
    title: "Année",
    key: "year",
    width: 60,
    show: "smAndUp",
  },
  {
    title: "Par",
    key: "authors_text",
  },
  {
    title: "Tags",
    key: "tags",
    width: 60,
    show: "mdAndUp",
  },
  {
    title: "Actions",
    key: "actions",
    align: "end",
    sortable: false,
  },
]

const headers = computed(() => {
  update()
  return headersDefinition.filter(
    (h) => !("show" in h) || (h.show === "mdAndUp" && mdAndUp.value) || (h.show === "smAndUp" && smAndUp.value)
  )
})

const handleRowClick = (event: Event, value: VDataTableRow) => {
  navigateTo(`/mixtapes/${value.item.id}`)
}

const handleEdit = (event: Event, id: string | number) => {
  navigateTo(`/mixtapes/edit/${id}`)
}

const handleDelete = (event: Event, id: string | number) => {
  idToDelete.value = id
  openConfirm.value = true
}

const handleCloseConfirm = () => {
  openConfirm.value = false
}

const handleConfirmDelete = async () => {
  if (idToDelete.value) {
    const { error } = await deleteMixtape(idToDelete.value)
    if (!error) {
      await fetchMixtapes()
    }
  }
}

const handleRefresh = async () => {
  await fetchMixtapes()
}

onMounted(() => {
  if (!filteredMixtapes.value.length) {
    fetchMixtapes()
  }
  if (!tags.value.length) {
    fetchTags()
  }
  document.body.addEventListener("resize", () => update())
})

onBeforeUnmount(() => {
  document.body.removeEventListener("resize", () => update())
})
</script>

<template>
  <PageHeader
    title="Les mixtapes"
    :actions="[
      { tooltip: 'Rafraîchir', icon: 'mdi-refresh', onClick: handleRefresh },
      { tooltip: 'Ajouter', icon: 'mdi-plus', onClick: () => navigateTo('/mixtapes/add') },
    ]"
  >
    <template #content>
      <v-text-field
        v-model="search"
        variant="solo"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher..."
        single-line
        hide-details
        clearable
      />
    </template>
  </PageHeader>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :headers="headers"
          :items="filteredMixtapes"
          :search="search"
          class="clickable"
          @click:row="handleRowClick"
        >
          <template #top>
            <v-toolbar class="pa-4" color="transparent" height="auto">
              <v-chip-group v-model:model-value="tagFilters" multiple column>
                <v-chip v-for="tag in tags" :key="tag.id" :value="tag.id" selected-class="text-primary" size="small">{{
                  tag.name
                }}</v-chip>
              </v-chip-group>
              <v-spacer></v-spacer>
              <v-btn
                v-if="tagFilters.length"
                icon="mdi-close-circle"
                size="small"
                variant="plain"
                @click="resetTagFilters"
              />
            </v-toolbar>
          </template>
          <template #item.name="{ item }">
            <div class="d-flex flex-row align-center">
              <v-avatar v-if="smAndUp" rounded color="grey-darken-3" class="mr-4">
                <v-img v-if="item.cover_url" :src="item.cover_url" cover />
                <v-icon v-else icon="mdi-image-off" color="grey-darken-2" />
              </v-avatar>
              <div>{{ item.name }}</div>
            </div>
          </template>
          <template #item.tracks="{ item }">
            <v-chip density="comfortable" :color="item.tracks.length ? 'success' : 'error'">{{
              item.tracks.length
            }}</v-chip>
          </template>
          <template #item.tags="{ item }">
            <v-tooltip location="bottom" content-class="bg-grey-darken-3" :disabled="!item.tags.length">
              <template #activator="{ props: activatorProps }">
                <v-chip
                  v-bind="activatorProps"
                  :color="!!item.tags.length ? 'info' : 'default'"
                  density="comfortable"
                  >{{ item.tags.length }}</v-chip
                >
              </template>
              <template #default>
                <v-chip
                  v-for="tag in item.tags"
                  :key="tag.id"
                  color="info"
                  variant="flat"
                  size="small"
                  density="comfortable"
                  class="mx-1"
                  >{{ tag.name }}</v-chip
                >
              </template>
            </v-tooltip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex flex-row justify-end">
              <v-btn
                icon="mdi-pencil"
                color="default"
                size="small"
                variant="text"
                @click.stop="(e: Event) => handleEdit(e, item.id)"
              />
              <v-btn
                icon="mdi-delete"
                color="default"
                size="small"
                variant="text"
                @click.stop="(e: Event) => handleDelete(e, item.id)"
              />
            </div>
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

<style lang="scss" scoped></style>
