<script lang="ts" setup>
  import { LoaderCircleIcon, PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.DJ, Role.MANAGER, Role.ADMIN] })

  const route = useRoute()
  const { getMixtapes, deleteMixtape, getAvailableYears } = useMixtapeApi()
  const { getDjs } = useDjApi()
  const { getTags } = useTagApi()

  // Récupérer toutes les années disponibles pour le filtre
  const { data: yearsData } = getAvailableYears()
  const allYears = computed(() => yearsData.value?.data || [])

  // Récupérer tous les DJs et Tags pour les filtres
  const { data: djsData } = getDjs({ limit: 1000 })
  const { data: tagsData } = getTags({ limit: 1000 })

  const allDjs = computed(() => djsData.value?.data || [])
  const allTags = computed(() => tagsData.value?.data || [])

  // Helper to normalize query params (string | string[] | null → string[])
  const normalizeQueryParam = (param: unknown): string[] => {
    if (Array.isArray(param)) {
      return param.filter((v): v is string => typeof v === 'string')
    }
    if (typeof param === 'string') {
      return [param]
    }
    return []
  }

  // Parse query params for API filters
  const queryParams = computed(() => {
    const params: Record<string, string | string[] | number> = {}

    // Pagination
    params.page = Number(route.query.page) || 1
    params.limit = Number(route.query.limit) || 10

    // Search
    if (route.query.name && typeof route.query.name === 'string') {
      params.search = route.query.name
    }

    // DJs filter
    const djs = normalizeQueryParam(route.query.djs)
    if (djs.length > 0) {
      params.djs = djs
    }

    // Tags filter
    const tags = normalizeQueryParam(route.query.tags)
    if (tags.length > 0) {
      params.tags = tags
    }

    // Year filter (exact or range)
    const years = normalizeQueryParam(route.query.year)
    if (years.length === 1 && years[0]) {
      params.year = years[0]
    } else if (years.length > 1) {
      // Multiple years: use range from min to max
      const yearNumbers = years.map(Number).filter((y) => !isNaN(y))
      if (yearNumbers.length > 0) {
        params.yearFrom = Math.min(...yearNumbers).toString()
        params.yearTo = Math.max(...yearNumbers).toString()
      }
    }

    return params
  })

  const { data, isPending, error, refetch } = getMixtapes(queryParams)

  const mixtapes = computed(() => data.value?.data || [])

  const paginationMeta = computed(() => {
    const pagination = data.value?.pagination
    if (!pagination) return undefined
    return {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      pageCount: pagination.totalPages,
    }
  })

  // Convert URL query params to ColumnFiltersState format for DataTable
  const activeFilters = computed(() => {
    const filters: { id: string; value: string | string[] }[] = []

    const djs = normalizeQueryParam(route.query.djs)
    if (djs.length > 0) {
      filters.push({ id: 'djs', value: djs })
    }

    const tags = normalizeQueryParam(route.query.tags)
    if (tags.length > 0) {
      filters.push({ id: 'tags', value: tags })
    }

    const years = normalizeQueryParam(route.query.year)
    if (years.length > 0) {
      filters.push({ id: 'year', value: years })
    }

    return filters
  })

  const hasActiveFilters = computed(() => {
    return !!(route.query.name || route.query.djs || route.query.tags || route.query.year)
  })

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

  const handleSearchChange = (search: string) => {
    const query: Record<string, string | string[]> = {
      page: '1', // Reset to page 1 on search
      limit: String(route.query.limit || 10),
    }

    // Add search to query if not empty
    if (search && search.trim()) {
      query.name = search.trim()
    }

    // Keep filters
    const djs = normalizeQueryParam(route.query.djs)
    if (djs.length > 0) {
      query.djs = djs
    }

    const tags = normalizeQueryParam(route.query.tags)
    if (tags.length > 0) {
      query.tags = tags
    }

    const years = normalizeQueryParam(route.query.year)
    if (years.length > 0) {
      query.year = years
    }

    navigateTo({ path: '/mixtapes', query })
  }

  // Debounce filter changes to avoid multiple rapid navigations
  let filterTimeout: ReturnType<typeof setTimeout> | null = null
  const handleFiltersChange = (filters: Record<string, string[]>) => {
    if (filterTimeout) clearTimeout(filterTimeout)

    filterTimeout = setTimeout(() => {
      const query: Record<string, string | string[]> = {
        // IMPORTANT: Reset to page 1 when filters change
        page: '1',
        limit: String(route.query.limit || 10),
      }

      // Keep search if exists
      if (route.query.name) {
        query.name = route.query.name.toString()
      }

      // Add filters to query (unwrap any reactive proxies)
      Object.entries(filters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          query[key] = Array.isArray(values) ? [...values] : values
        }
      })

      navigateTo({ path: '/mixtapes', query })
    }, 300) // 300ms debounce
  }

  const handleRowDelete = async (id: string) => {
    try {
      await deleteMixtape.mutateAsync(id)
      toast.success('Mixtape supprimée !')
    } catch {
      toast.error('Une erreur est survenue lors de la suppression de la mixtape.')
    }
  }

  const handlePageChange = (page: number) => {
    const query: Record<string, string | string[]> = {
      page: String(page),
      limit: String(route.query.limit || 10),
    }

    // Keep search
    if (route.query.name) {
      query.name = String(route.query.name)
    }

    // Keep filters using normalizeQueryParam
    const djs = normalizeQueryParam(route.query.djs)
    if (djs.length > 0) {
      query.djs = djs
    }

    const tags = normalizeQueryParam(route.query.tags)
    if (tags.length > 0) {
      query.tags = tags
    }

    const years = normalizeQueryParam(route.query.year)
    if (years.length > 0) {
      query.year = years
    }

    navigateTo({ path: '/mixtapes', query })
  }

  const handleLimitChange = (limit: number) => {
    const query: Record<string, string | string[]> = {
      page: '1',
      limit: String(limit),
    }

    // Keep search
    if (route.query.name) {
      query.name = String(route.query.name)
    }

    // Keep filters using normalizeQueryParam
    const djs = normalizeQueryParam(route.query.djs)
    if (djs.length > 0) {
      query.djs = djs
    }

    const tags = normalizeQueryParam(route.query.tags)
    if (tags.length > 0) {
      query.tags = tags
    }

    const years = normalizeQueryParam(route.query.year)
    if (years.length > 0) {
      query.year = years
    }

    navigateTo({ path: '/mixtapes', query })
  }

  // Permissions
  const { canCreateMixtape } = usePermissions()
</script>

<template>
  <PageHeader title="Les mixtapes">
    <template #actions>
      <Button size="fab" :variant="variant" @click="handleRefresh">
        <LoaderCircleIcon v-if="pending" class="animate-spin" />
        <RefreshCwIcon v-else />
      </Button>
      <Button v-if="canCreateMixtape" as-child size="fab" variant="outline">
        <NuxtLink to="/mixtapes/add">
          <PlusIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <MixtapeTable
    :data="mixtapes"
    :all-djs="allDjs"
    :all-tags="allTags"
    :all-years="allYears"
    :has-active-filters="hasActiveFilters"
    :search-value="route.query.name?.toString()"
    :active-filters="activeFilters"
    :server-pagination="paginationMeta"
    :sibling-count="2"
    :loading="pending"
    @clear-search="handleClearSearch"
    @search-change="handleSearchChange"
    @filters-change="handleFiltersChange"
    @page-change="handlePageChange"
    @limit-change="handleLimitChange"
    @row-show="handleRowShow"
    @row-edit="handleRowEdit"
    @row-delete="handleRowDelete"
  />
</template>
