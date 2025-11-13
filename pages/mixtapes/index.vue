<script lang="ts" setup>
  import { LoaderCircleIcon, PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const route = useRoute()
  const { getMixtapes, deleteMixtape } = useMixtapeApi()

  // Get query params for filtering
  const queryParams = computed(() => ({
    search: route.query.name?.toString(),
  }))

  const { data, isPending, error, refetch } = getMixtapes(queryParams)

  const mixtapes = computed(() => data.value?.data || [])

  const variant = computed(() => {
    if (isPending.value) return 'primaryMuted'
    return 'outline'
  })
  
  const pending = isPending

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des mixtapes.')
    }
  })

  const handleRefresh = async () => {
    await refetch()
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
      await deleteMixtape.mutateAsync(id)
      toast.success('Mixtape supprimée !')
    } catch {
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
      <Button as-child size="fab" variant="outline">
        <NuxtLink to="/mixtapes/add">
          <PlusIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <MixtapeTable
    :data="mixtapes"
    :search-value="route.query.name?.toString()"
    @clear-search="handleClearSearch"
    @row-show="handleRowShow"
    @row-edit="handleRowEdit"
    @row-delete="handleRowDelete"
  />
</template>
