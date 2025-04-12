<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'

  definePageMeta({ middleware: ['auth'] })

  // const { smAndUp, mdAndUp, update } = useDisplay()
  const { loading } = useLoadingStoreRefs()
  const { fetchMixtapes, deleteMixtape, resetTagFilters } = useMixtapesStore()
  const { filteredData: filteredMixtapes, tagFilters, search, itemsPerPage, page } = useMixtapesStoreRefs()
  const { fetchTags } = useTagsStore()
  const { data: tags } = useTagsStoreRefs()

  const idToDelete = ref<string | number | null>(null)
  const openConfirm = ref(false)

  // const headers = computed(() => {
  //   update()
  //   return headersDefinition.value.filter(
  //     (h) => !('show' in h) || (h.show === 'mdAndUp' && mdAndUp.value) || (h.show === 'smAndUp' && smAndUp.value),
  //   )
  // })

  const handleRowClick = async (id: string | number) => {
    await navigateTo(`/mixtapes/${id}`)
  }

  const handleEdit = async (id: string | number) => {
    await navigateTo(`/mixtapes/${id}/edit`)
  }

  const handleDelete = (id: string | number) => {
    idToDelete.value = id
    openConfirm.value = true
  }

  // const handleCloseConfirm = () => {
  //   openConfirm.value = false
  // }

  // const handleConfirmDelete = async () => {
  //   if (idToDelete.value) {
  //     const { error } = await deleteMixtape(idToDelete.value)
  //     if (!error) {
  //       await fetchMixtapes()
  //     }
  //   }
  // }

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
    // document.body.addEventListener('resize', () => update())
  })

  onBeforeUnmount(() => {
    // document.body.removeEventListener('resize', () => update())
  })
</script>

<template>
  <PageHeader title="Les mixtapes">
    <template #actions>
      <Button size="icon" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
      <Button asChild size="icon" variant="outline">
        <NuxtLink to="/mixtapes/add">
          <PlusIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <MixtapeTable
    :data="filteredMixtapes"
    :loading="loading"
    @rowClick="handleRowClick"
    @rowEdit="handleEdit"
    @rowDelete="handleDelete"
  />
</template>
