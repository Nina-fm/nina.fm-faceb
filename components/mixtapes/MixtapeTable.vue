<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import { computed, h, resolveComponent } from 'vue'
  import { toast } from 'vue-sonner'
  import type { FilterDef } from '~/components/ui/data-table'
  import type { Mixtape } from '~/types/api/mixtapes.types'
  import type { Tag } from '~/types/api/tags.types'

  const ImageIcon = await import('lucide-vue-next').then((module) => module.ImageIcon)

  const Avatar = resolveComponent('Avatar')
  const AvatarFallback = resolveComponent('AvatarFallback')
  const AvatarImage = resolveComponent('AvatarImage')
  const MixtapeTableActions = resolveComponent('MixtapeTableActions')
  const TagBadge = resolveComponent('TagBadge')
  const TooltipedBadge = resolveComponent('TooltipedBadge')

  const props = withDefaults(
    defineProps<{
      data?: Mixtape[]
      searchValue?: string | number
      loading?: boolean
      currentUserId?: string
    }>(),
    {
      data: () => [],
      searchValue: undefined,
      loading: false,
      currentUserId: undefined,
    },
  )

  const emit = defineEmits<{
    clearSearch: []
    rowShow: [id: string]
    rowEdit: [id: string]
    rowDelete: [id: string]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  // Extract unique DJs from mixtapes
  const djsFilterOptions = computed(() => {
    const djsMap = new Map<string, string>()
    props.data.forEach((mixtape) => {
      mixtape.djs?.forEach((dj) => {
        if (!djsMap.has(dj.id)) {
          djsMap.set(dj.id, dj.name)
        }
      })
    })
    return Array.from(djsMap.values())
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        label: name,
        value: name,
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

  // Extract unique tags from mixtapes
  const tagsFilterOptions = computed(() => {
    const tagsMap = new Map<string, Tag>()
    props.data.forEach((mixtape) => {
      mixtape.tags?.forEach((tag) => {
        if (!tagsMap.has(tag.id)) {
          tagsMap.set(tag.id, tag)
        }
      })
    })
    return Array.from(tagsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((tag) => ({
        label: tag.name,
        renderLabel: h(TagBadge, { color: tag?.color ?? '' }),
        value: tag.id,
      }))
  })

  const filters: FilterDef[] = [
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
  ]

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
      filterFn: (row, columnId, filterValue) => {
        const djs = row.getValue<{ id: string; name: string }[]>(columnId)
        if (!djs || !filterValue || filterValue.length === 0) return true
        const djNames = djs.map((dj) => dj.name)
        return filterValue.some((filterDj: string) => djNames.includes(filterDj))
      },
      cell: ({ cell }) => {
        const djs = cell.getValue() as { name: string }[] | undefined
        const djNames = djs?.map((dj) => dj.name).join(', ') || '-'
        return h('span', {}, { default: () => [djNames] })
      },
    },
    {
      accessorKey: 'year',
      header: 'Création',
      size: 30,
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
      filterFn: (row, columnId, filterValue) => {
        const tags = row.getValue<Tag[]>(columnId)
        if (!tags || !filterValue || filterValue.length === 0) return true
        return filterValue.every((tagId: string) => tags.some((tag) => tag.id === tagId))
      },
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
      v-if="data.length"
      :data="data"
      :columns="columns"
      :sorting="defaultSorting"
      :search-value="searchValue"
      :filters="filters"
      search
      pagination
      background
      @row-click="handleRowShow"
      @clear-search="handleClearSearch"
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
