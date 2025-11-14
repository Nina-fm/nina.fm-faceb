<script lang="ts" setup>
  import { LoaderCircleIcon, PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const route = useRoute()
  const { getMixtapes, deleteMixtape } = useMixtapeApi()
  const { getDjs } = useDjApi()
  const { getTags } = useTagApi()

  // Load all DJs and Tags for filter options
  const { data: djsData } = getDjs()
  const { data: tagsData } = getTags()

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
    const params: Record<string, string | string[]> = {}

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

  // Debounce filter changes to avoid multiple rapid navigations
  let filterTimeout: ReturnType<typeof setTimeout> | null = null
  const handleFiltersChange = (filters: Record<string, string[]>) => {
    if (filterTimeout) clearTimeout(filterTimeout)

    filterTimeout = setTimeout(() => {
      const query: Record<string, string | string[]> = {}

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
    :all-djs="allDjs"
    :all-tags="allTags"
    :has-active-filters="hasActiveFilters"
    :search-value="route.query.name?.toString()"
    @clear-search="handleClearSearch"
    @filters-change="handleFiltersChange"
    @row-show="handleRowShow"
    @row-edit="handleRowEdit"
    @row-delete="handleRowDelete"
  />
</template>
