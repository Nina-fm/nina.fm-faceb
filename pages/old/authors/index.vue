<script lang="ts" setup>
  const { loading } = useLoadingStoreRefs()
  const { fetchAuthors, deleteAuthor } = useAuthorsStore()
  const { data: authors } = useAuthorsStoreRefs()
  const itemsPerPage = ref(-1)
  const search = ref(null)
  const idToDelete = ref<string | number | null>(null)
  const openConfirm = ref(false)

  const handleRowClick = (id: string | number) => {
    navigateTo(`/authors/${id}`)
  }

  const handleRowEdit = (id: string | number) => {
    navigateTo(`/authors/${id}/edit`)
  }

  const handleRowDelete = (id: string | number) => {
    idToDelete.value = id
    openConfirm.value = true
  }

  const handleCloseConfirm = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    if (idToDelete.value) {
      const { error } = await deleteAuthor(idToDelete.value)
      if (!error) {
        await fetchAuthors()
      }
    }
  }

  const handleRefresh = async () => {
    await fetchAuthors()
  }

  onMounted(() => fetchAuthors())
</script>

<template>
  <PageHeader
    title="Les DJ's"
    :actions="[
      { icon: 'mdi-refresh', onClick: handleRefresh },
      { icon: 'mdi-plus', onClick: () => navigateTo('/authors/add') },
    ]"
  >
    <template #content></template>
  </PageHeader>
  <AuthorsTable
    :data="authors"
    :loading="loading"
    @rowClick="handleRowClick"
    @rowEdit="handleRowEdit"
    @rowDelete="handleRowDelete"
  />
</template>
