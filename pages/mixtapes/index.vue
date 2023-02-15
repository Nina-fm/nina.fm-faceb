<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { Tag } from '~~/types/supatypes';

definePageMeta({ middleware: ["auth"] })

interface TagFilter {
  tag_id: number;
  exclude?: boolean;
}

interface Filters {
  tags: TagFilter[]
}

const { fetchMixtapes, deleteMixtape } = useMixtapesStore()
const { data: mixtapes } = storeToRefs(useMixtapesStore());
const { fetchTags } = useTagsStore()
const { data: tags } = storeToRefs(useTagsStore());
const search = ref(null);
const filters: Filters = reactive({
  tags: []
})
const itemsPerPage = ref(50)
const idToDelete = ref<string | number | null>(null)
const openConfirm = ref(false);
const { smAndUp, mdAndUp, update } = useDisplay();
const headersDefinition = [
  {
    title: 'Mixtape',
    key: 'name',
  },
  {
    title: "Pistes",
    key: 'tracks',
    width: 60,
    show: "mdAndUp"
  },
  {
    title: 'Année',
    key: 'year',
    width: 60,
    show: "smAndUp"
  },
  {
    title: 'Par',
    key: 'created_by',
  },
  {
    title: 'Tags',
    key: 'tags',
    width: 60,
    show: "mdAndUp"
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'end',
    sortable: false
  }
];
const headers = computed(() => {
  update();
  return headersDefinition.filter((h) =>
    (!("show" in h) || h.show === "mdAndUp" && mdAndUp.value || h.show === "smAndUp" && smAndUp.value)
  )
})
const activeTags = computed(() => filters.tags.reduce((r, t) => [...r, t.tag_id], [] as number[]));
const filteredMixtapes = computed(() => mixtapes.value.filter((m) => {
  if (activeTags.value.length) {
    return m.tags.reduce((r: boolean, t: Tag) => {
      return activeTags.value.includes(t.id)
    }, false);
  }
  return true;
}))

const isFilterActive = (tagId: number) => !!filters.tags.find((t) => t.tag_id === tagId);

const handleAddFilter = (tag: Tag) => {
  const index = filters.tags.findIndex((t) => t.tag_id === tag.id)
  if (index >= 0) {
    filters.tags.splice(index, 1);
  } else {
    filters.tags.push({
      tag_id: tag.id,
    })
  }
}

const handleClearTagFilters = () => {
  filters.tags.splice(0, filters.tags.length)
}

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

onMounted(() => {
  fetchMixtapes()
  fetchTags()
  document.body.addEventListener('resize', () => update())
})
</script>

<template>
  <PageHeader title="Les mixtapes" :actions="[
    { tooltip: 'Import', icon: 'mdi-database-arrow-up', onClick: () => navigateTo('/mixtapes/import') },
    { tooltip: 'Rafraîchir', icon: 'mdi-refresh', onClick: handleRefresh },
    { tooltip: 'Ajouter', icon: 'mdi-plus', onClick: () => navigateTo('/mixtapes/add') }
  ]">
    <template #content>
      <v-text-field v-model="search" variant="solo" density="compact" prepend-inner-icon="mdi-magnify"
        placeholder="Rechercher..." single-line hide-details clearable />
    </template>
  </PageHeader>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="filteredMixtapes"
          :search="search" class="clickable" @click:row="handleRowClick">
          <template v-slot:top>
            <v-toolbar class="pa-4" color="transparent">
              <v-chip-group multiple column>
                <v-chip v-for="tag in tags" :filter="isFilterActive(tag.id)" size="small"
                  @click="() => handleAddFilter(tag)">{{ tag.name }}</v-chip>
              </v-chip-group>
              <v-spacer></v-spacer>
              <v-btn v-if="activeTags.length" icon="mdi-close-circle" size="small" variant="plain"
                @click="handleClearTagFilters" />
            </v-toolbar>
          </template>
          <template v-slot:item.name="{ item }">
            <div class="d-flex flex-row align-center">
              <v-avatar rounded color="grey-darken-3" class="mr-4" v-if="smAndUp">
                <v-img v-if="item.raw.cover_url" :src="item.raw.cover_url" cover />
                <v-icon v-else icon="mdi-image-off" color="grey-darken-2" />
              </v-avatar>
              <div>{{ item.raw.name }}</div>
            </div>
          </template>
          <template v-slot:item.tracks="{ item }">
            <v-chip density="comfortable" :color="item.raw.tracks.length ? 'success' : 'error'">{{
              item.raw.tracks.length
            }}</v-chip>
          </template>
          <template v-slot:item.tags="{ item }">
            <v-tooltip location="bottom" content-class="bg-grey-darken-3" :disabled="!item.raw.tags.length">
              <template v-slot:activator="{ props }">
                <v-chip v-bind="props" :color="!!item.raw.tags.length ? 'info' : 'default'" density="comfortable">{{
                  item.raw.tags.length
                }}</v-chip>
              </template>
              <template v-slot:default>
                <v-chip v-for="tag in   item.raw.tags" color="info" variant="flat" size="small" density="comfortable"
                  class="mx-1">{{
                    tag.name
                  }}</v-chip>
              </template>
            </v-tooltip>
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
      <p>La mixtape sera supprimée définitivement.</p>
      <p>Confirmez-vous l'action ?</p>
    </Confirm>
  </v-container>
</template>

<style scoped>

</style>
