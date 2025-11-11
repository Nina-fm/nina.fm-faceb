<script lang="ts" setup>
  import { LoaderCircleIcon, PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const route = useRoute()
  const { getTags, deleteTag } = useTagApi()

  // Query params
  const page = computed(() => Number(route.query.page) || 1)
  const limit = computed(() => Number(route.query.limit) || 10)
  const search = computed(() => route.query.search?.toString())
  const hasUsage = computed(() => (route.query.hasUsage === 'true' ? true : undefined))

  // Fetch tags avec query params
  const {
    data: tagsData,
    isPending: pending,
    error,
    refetch: refresh,
  } = getTags(
    computed(() => ({
      page: page.value,
      limit: limit.value,
      search: search.value,
      hasUsage: hasUsage.value,
    })),
  )

  const tags = computed(() => tagsData.value?.data || [])

  const variant = computed(() => {
    if (pending.value) return 'primaryMuted'
    return 'outline'
  })

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des tags.')
    }
  })

  const handleRefresh = async () => {
    await refresh()
  }

  const handleRowShow = (id: string) => {
    return navigateTo(`/tags/${id}`)
  }

  const handleRowEdit = (id: string) => {
    return navigateTo(`/tags/${id}/edit`)
  }

  const handleClearSearch = () => {
    return navigateTo('/tags')
  }

  const handleRowDelete = async (id: string) => {
    try {
      await deleteTag.mutateAsync(id)
      toast.success('Tag supprimé !')
    } catch {
      toast.error('Une erreur est survenue lors de la suppression du Tag.')
    }
  }
</script>

<template>
  <PageHeader title="Les tags">
    <template #actions>
      <Button size="fab" :variant="variant" @click="handleRefresh">
        <LoaderCircleIcon v-if="pending" class="animate-spin" />
        <RefreshCwIcon v-else />
      </Button>
      <Button as-child size="fab" variant="outline">
        <NuxtLink to="/tags/add">
          <PlusIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <TagTable
    :data="tags"
    :loading="pending"
    :search-value="route.query.name?.toString()"
    @clear-search="handleClearSearch"
    @row-show="handleRowShow"
    @row-edit="handleRowEdit"
    @row-delete="handleRowDelete"
  />
</template>
