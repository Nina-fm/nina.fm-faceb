<script lang="ts" setup>
  import { LoaderCircleIcon, PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const route = useRoute()
  const { pending, fetchMixtapes, deleteMixtape } = useMixtapeApi()
  const { data, error, refresh } = await useAsyncData('mixtapes', () => fetchMixtapes())

  const mixtapes = computed(() => data.value?.results || [])

  const variant = computed(() => {
    if (pending.value) return 'primaryMuted'
    return 'outline'
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

  const handleClearSearch = () => {
    return navigateTo('/mixtapes')
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
      <Button size="fab" :variant="variant" @click="handleRefresh">
        <LoaderCircleIcon v-if="pending" class="animate-spin" />
        <RefreshCwIcon v-else />
      </Button>
      <Button asChild size="fab" variant="outline">
        <NuxtLink to="/mixtapes/add">
          <PlusIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <MixtapeTable
    :data="mixtapes"
    :searchValue="route.query.name?.toString()"
    @clearSearch="handleClearSearch"
    @rowShow="handleRowShow"
    @rowEdit="handleRowEdit"
    @rowDelete="handleRowDelete"
  />
</template>
