<script lang="ts" setup>
  import { LoaderCircleIcon, PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ requiresRoles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR, Role.VIEWER] })

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

  const paginationMeta = computed(() => {
    const pagination = tagsData.value?.pagination
    if (!pagination) return undefined
    return {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      pageCount: pagination.totalPages,
    }
  })

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

  const handlePageChange = (page: number) => {
    const query: Record<string, string | number> = {
      page,
      limit: limit.value,
    }
    if (search.value) query.search = search.value
    if (hasUsage.value !== undefined) query.hasUsage = hasUsage.value.toString()

    navigateTo({ path: '/tags', query })
  }

  const handleLimitChange = (newLimit: number) => {
    const query: Record<string, string | number> = {
      page: 1,
      limit: newLimit,
    }
    if (search.value) query.search = search.value
    if (hasUsage.value !== undefined) query.hasUsage = hasUsage.value.toString()

    navigateTo({ path: '/tags', query })
  }

  // Permissions
  const { canCreateTag } = usePermissions()
</script>

<template>
  <PageHeader title="Les tags">
    <template #actions>
      <Button size="fab" :variant="variant" @click="handleRefresh">
        <LoaderCircleIcon v-if="pending" class="animate-spin" />
        <RefreshCwIcon v-else />
      </Button>
      <Button v-if="canCreateTag" as-child size="fab" variant="outline">
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
    :server-pagination="paginationMeta"
    @clear-search="handleClearSearch"
    @row-show="handleRowShow"
    @row-edit="handleRowEdit"
    @row-delete="handleRowDelete"
    @page-change="handlePageChange"
    @limit-change="handleLimitChange"
  />
</template>
