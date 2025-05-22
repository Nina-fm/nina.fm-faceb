<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import { useDjApi } from '~/composables/djApi'

  definePageMeta({ roles: ['ADMIN'] })

  const { user: currentUser } = useAuthApi()
  const { fetchDjs, deleteDj } = useDjApi()
  const { data, error, refresh, status } = await useAsyncData('djs', () => fetchDjs())

  const isLoading = ref(false)
  const openInviteDialog = ref(false)
  const djs = computed(() => data.value?.results || [])

  watch(status, (newStatus) => {
    if (newStatus === 'pending') {
      isLoading.value = true
    } else {
      setTimeout(() => (isLoading.value = false), 500)
    }
  })

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des djs.')
    }
  })

  const handleRowShow = (id: string) => {
    return navigateTo(`/djs/${id}`)
  }

  const handleRefresh = async () => {
    await refresh()
  }

  const handleRowEdit = (id: string) => {
    return navigateTo(`/djs/${id}/edit`)
  }

  const handleRowDelete = async (id: string) => {
    try {
      await deleteDj(id)
      await refresh()
      toast.success('Dj supprimé !')
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression du dj.')
    }
  }
</script>

<template>
  <PageHeader title="Les DJ's">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
      <Button size="fab" variant="outline" asChild>
        <NuxtLink to="/djs/add"><PlusIcon /></NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <DjsTable
    :data="djs"
    :currentUserId="currentUser?.id"
    @row-show="handleRowShow"
    @row-edit="handleRowEdit"
    @row-delete="handleRowDelete"
  />
  <LoadingOverlay :active="isLoading" />
</template>
