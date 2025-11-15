<script setup lang="ts">
  import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/vue-table'
  import { computed, h, resolveComponent } from 'vue'
  import { toast } from 'vue-sonner'
  import type { FilterDef } from '~/components/ui/data-table'
  import type { Dj } from '~/types/api/djs.types'
  import type { Mixtape } from '~/types/api/mixtapes.types'
  import type { Tag } from '~/types/api/tags.types'

  const ImageIcon = await import('lucide-vue-next').then((module) => module.ImageIcon)

  const Avatar = resolveComponent('Avatar')
  const AvatarFallback = resolveComponent('AvatarFallback')
  const AvatarImage = resolveComponent('AvatarImage')
  const MixtapeTableActions = resolveComponent('MixtapeTableActions')
  const TagBadge = resolveComponent('TagBadge')
  const TooltipedBadge = resolveComponent('TooltipedBadge')

  // Permissions
  const { canManageMixtapes } = usePermissions()

  const props = withDefaults(
    defineProps<{
      data?: Mixtape[]
      allDjs?: Dj[]
      allTags?: Tag[]
      hasActiveFilters?: boolean
      searchValue?: string | number
      loading?: boolean
      currentUserId?: string
      activeFilters?: ColumnFiltersState
    }>(),
    {
      data: () => [],
      allDjs: () => [],
      allTags: () => [],
      hasActiveFilters: false,
      searchValue: undefined,
      loading: false,
      currentUserId: undefined,
      activeFilters: () => [],
    },
  )

  const emit = defineEmits<{
    clearSearch: []
    rowShow: [id: string]
    rowEdit: [id: string]
    rowDelete: [id: string]
    filtersChange: [filters: Record<string, string[]>]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  // Use DJs and Tags from props (loaded in parent page)
  const djsFilterOptions = computed(() => {
    return [...props.allDjs]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((dj) => ({
        label: dj.name,
        value: dj.slug,
      }))
  })

  const yearsFilterOptions = computed(() => {
    const years = props.data.map((m) => m.year).filter((y) => y)
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a)
    return uniqueYears.map((year) => ({
      label: String(year),
      value: String(year),
    }))
  })

  // Extract unique tags from API
  const tagsFilterOptions = computed(() => {
    return [...props.allTags]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((tag) => ({
        label: tag.name,
        renderLabel: h(TagBadge, { color: tag?.color ?? '' }),
        value: tag.slug,
      }))
  })

  const filters = computed<FilterDef[]>(() => [
    {
      id: 'djs',
      label: "Dj's",
      options: djsFilterOptions.value,
      multiple: true,
    },
    {
      id: 'year',
      label: 'Année',
      options: yearsFilterOptions.value,
      multiple: true,
    },
    {
      id: 'tags',
      label: 'Tags',
      selectedLabel: 'Tag',
      options: tagsFilterOptions.value,
      multiple: true,
    },
  ])

  const defaultSorting = ref<SortingState>([
    {
      id: 'year',
      desc: true,
    },
  ])

  const columns: ColumnDef<Mixtape>[] = [
    {
      accessorKey: 'name',
      header: 'Mixtape',
      cell: ({ cell }) => {
        const name = cell.getValue() as string
        const cover = cell.row.original.cover
        const { getImageUrl } = useImageApi()
        return h(
          'span',
          { class: 'flex gap-3 items-center' },
          {
            default: () => [
              h(
                Avatar,
                { class: 'rounded size-10' },
                {
                  default: () => [
                    ...(cover
                      ? [
                          h(AvatarImage, {
                            src: getImageUrl(cover),
                            alt: cover.originalName,
                          }),
                        ]
                      : []),
                    h(
                      AvatarFallback,
                      { class: 'rounded-sm' },
                      { default: () => [h(ImageIcon, { class: 'size-4 text-muted-foreground' })] },
                    ),
                  ],
                },
              ),
              name,
            ],
          },
        )
      },
    },
    {
      accessorKey: 'djs',
      header: 'Par',
      enableColumnFilter: false,
      cell: ({ cell }) => {
        const djs = cell.getValue() as { name: string }[] | undefined
        const djNames = formatDjs(djs)
        return h('span', {}, { default: () => [djNames] })
      },
    },
    {
      accessorKey: 'year',
      header: 'Création',
      size: 30,
      enableColumnFilter: false,
      cell: ({ cell }) => {
        const year = cell.getValue() as string
        return h('span', {}, { default: () => [year] })
      },
    },
    {
      accessorKey: 'tracks',
      header: 'Pistes',
      size: 30,
      cell: ({ cell }) => {
        const tracksAsText = cell.row.original.tracksAsText
        const tracksCount = tracksAsText ? tracksAsText.split('\n').filter((l) => l.trim()).length : 0
        return h(
          TooltipedBadge,
          {
            variant: tracksCount ? 'successMuted' : 'destructiveMuted',
            tooltip: tracksCount ? `${tracksCount} piste${tracksCount > 1 ? 's' : ''}` : 'Aucune piste',
          },
          {
            default: () => [tracksCount],
          },
        )
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      size: 30,
      enableColumnFilter: false,
      cell: ({ cell }) => {
        const tags = cell.getValue() as Tag[] | undefined
        const tagsCount = tags?.length ?? 0
        return h(
          TooltipedBadge,
          {
            variant: tagsCount ? 'infoMuted' : 'outline',
            tooltip: tags?.map((t) => t.name).join(', ') || 'Aucun tag',
          },
          {
            default: () => [tagsCount],
          },
        )
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 40,
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const id = cell.row.original.id.toString()
        return h(MixtapeTableActions, {
          deletable: canManageMixtapes.value,
          editable: canManageMixtapes.value,
          onShow: () => handleRowShow(id),
          onEdit: () => handleRowEdit(id),
          onDelete: () => handleRowDelete(id),
        })
      },
    },
  ]

  const handleRowShow = (id: string | number) => {
    emit('rowShow', id.toString())
  }

  const handleRowEdit = (id: string) => {
    emit('rowEdit', id)
  }

  const handleClearSearch = () => {
    emit('clearSearch')
  }

  const handleFiltersChange = (filters: ColumnFiltersState) => {
    // Convert TanStack ColumnFiltersState to simple object for URL query params
    const filterObj: Record<string, string[]> = {}

    filters.forEach((filter: { id: string; value: unknown }) => {
      if (Array.isArray(filter.value)) {
        // Unwrap reactive proxy to plain array
        filterObj[filter.id] = [...(filter.value as string[])]
      } else if (filter.value) {
        filterObj[filter.id] = [String(filter.value)]
      }
    })

    emit('filtersChange', filterObj)
  }

  const handleRowDelete = (id: string) => {
    idToDelete.value = id
    openConfirm.value = true
  }

  const handleCancelDelete = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    if (idToDelete.value) {
      try {
        emit('rowDelete', idToDelete.value)
      } catch {
        toast.error('Une erreur est survenue lors de la suppression de la mixtape.')
      } finally {
        openConfirm.value = false
      }
    }
  }
</script>

<template>
  <div class="py-10">
    <DataTable
      v-if="data.length || hasActiveFilters"
      :data="data"
      :columns="columns"
      :sorting="defaultSorting"
      :search-value="searchValue"
      :filters="filters"
      :active-filters="activeFilters"
      search
      pagination
      background
      @row-click="handleRowShow"
      @clear-search="handleClearSearch"
      @filter-change="handleFiltersChange"
    />
    <EmptyBlock v-else title="Aucune mixtape actuellement.">
      <Button variant="secondary" as-child>
        <NuxtLink to="/mixtapes/add">Créer une mixtape</NuxtLink>
      </Button>
    </EmptyBlock>
  </div>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cette mixtape ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
