<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const { user: currentUser } = useAuthApi()
  const { fetchMixtapes, deleteMixtape } = useMixtapeApi()
  const { data, error, refresh, status } = await useAsyncData('mixtapes', () => fetchMixtapes())

  const isLoading = ref(false)
  const openInviteDialog = ref(false)
  const mixtapes = computed(() => data.value?.results || [])

  watch(status, (newStatus) => {
    if (newStatus === 'pending') {
      isLoading.value = true
    } else {
      setTimeout(() => (isLoading.value = false), 500)
    }
  })

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des mixtapes.')
    }
  })

  const handleRefresh = async () => {
    await refresh()
  }

  const handleRowShow = (id: string) => {
    return navigateTo(`/mixtapes/${id}`)
  }

  const handleRowEdit = (id: string) => {
    return navigateTo(`/mixtapes/${id}/edit`)
  }

  const handleRowDelete = async (id: string) => {
    try {
      await deleteMixtape(id)
      await refresh()
      toast.success('Mixtape supprimée !')
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression de la mixtape.')
    }
  }
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
  <MixtapeTable :data="mixtapes" @rowShow="handleRowShow" @rowEdit="handleRowEdit" @rowDelete="handleRowDelete" />
</template>
