<script lang="ts" setup>
  import { LoaderCircleIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR, Role.VIEWER] })

  const route = useRoute()
  const { getDjs } = useDjApi()

  // Query params
  const page = computed(() => Number(route.query.page) || 1)
  const limit = computed(() => Number(route.query.limit) || 10)
  const search = computed(() => route.query.search?.toString())
  const hasMixtapes = computed(() => (route.query.hasMixtapes === 'true' ? true : undefined))

  // Fetch DJs avec query params
  const {
    data: djsData,
    isPending: pending,
    error,
    refetch: refresh,
  } = getDjs(
    computed(() => ({
      page: page.value,
      limit: limit.value,
      search: search.value,
      hasMixtapes: hasMixtapes.value,
    })),
  )

  const djs = computed(() => djsData.value?.data || [])

  const paginationMeta = computed(() => {
    const pagination = djsData.value?.pagination
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
      toast.error('Une erreur est survenue lors de la récupération des DJs.')
    }
  })

  const handleRefresh = async () => {
    await refresh()
  }

  const handleShowMixtapes = (name: string) => {
    return navigateTo({ path: '/mixtapes', query: { djs: [name] } })
  }

  const handlePageChange = (page: number) => {
    const query: Record<string, string | number> = {
      page,
      limit: limit.value,
    }
    if (search.value) query.search = search.value
    if (hasMixtapes.value !== undefined) query.hasMixtapes = hasMixtapes.value.toString()

    navigateTo({ path: '/djs', query })
  }

  const handleLimitChange = (newLimit: number) => {
    const query: Record<string, string | number> = {
      page: 1,
      limit: newLimit,
    }
    if (search.value) query.search = search.value
    if (hasMixtapes.value !== undefined) query.hasMixtapes = hasMixtapes.value.toString()

    navigateTo({ path: '/djs', query })
  }
</script>

<template>
  <PageHeader title="Les DJ's">
    <template #actions>
      <Button size="fab" :variant="variant" @click="handleRefresh">
        <LoaderCircleIcon v-if="pending" class="animate-spin" />
        <RefreshCwIcon v-else />
      </Button>
    </template>
  </PageHeader>
  <DjTable
    :data="djs"
    :loading="pending"
    :server-pagination="paginationMeta"
    @row-show-mixtapes="handleShowMixtapes"
    @page-change="handlePageChange"
    @limit-change="handleLimitChange"
  />
</template>
