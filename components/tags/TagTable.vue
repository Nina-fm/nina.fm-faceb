<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { Mixtape } from '~/types/api/mixtapes.types'
  import type { Tag } from '~/types/api/tags.types'

  const Badge = resolveComponent('Badge')
  const TagBadge = resolveComponent('TagBadge')
  const TagTableActions = resolveComponent('TagTableActions')

  const { canManageTags } = usePermissions()

  withDefaults(
    defineProps<{
      data?: Tag[]
      searchValue?: string | number
      loading?: boolean
      serverPagination?: {
        total: number
        page: number
        limit: number
        pageCount: number
      }
    }>(),
    {
      data: () => [],
      searchValue: undefined,
      loading: false,
      serverPagination: undefined,
    },
  )

  const emit = defineEmits<{
    clearSearch: []
    rowShow: [id: string]
    rowEdit: [id: string]
    rowDelete: [id: string]
    pageChange: [page: number]
    limitChange: [limit: number]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  const defaultSorting = ref<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ])

  const columns: ColumnDef<Tag>[] = [
    {
      accessorKey: 'name',
      header: 'Tag',
      cell: ({ cell }) => {
        const name = cell.getValue() as string
        const color = cell.row.original.color || undefined // Default to black if no color is set
        return h(
          'span',
          { class: 'flex gap-3 items-center' },
          {
            default: () => [h(TagBadge, { color }, { default: () => [name] })],
          },
        )
      },
    },
    {
      accessorKey: 'mixtapes',
      header: 'Mixtapes',
      size: 30,
      cell: ({ cell }) => {
        const mixtapes = cell.getValue() as Mixtape[] | undefined
        const mixtapesCount = mixtapes?.length || 0
        return h(Badge, { variant: mixtapesCount ? 'primaryMuted' : 'outline' }, { default: () => [mixtapesCount] })
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Création',
      size: 30,
      cell: ({ cell }) => {
        const createdAt = new Date(cell.getValue() as string)
        return h('span', {}, { default: () => [createdAt.toLocaleDateString('fr-FR', { dateStyle: 'short' })] })
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 40,
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const id = cell.row.original.id.toString()
        return h(TagTableActions, {
          editable: canManageTags.value,
          deletable: canManageTags.value,
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
        toast.error('Une erreur est survenue lors de la suppression du Tag.')
      } finally {
        openConfirm.value = false
      }
    }
  }
</script>

<template>
  <div class="py-10">
    <DataTable
      v-if="data.length || loading"
      :data="data"
      :columns="columns"
      :sorting="defaultSorting"
      :search-value="searchValue"
      :server-pagination="serverPagination"
      :loading="loading"
      search
      pagination
      background
      @row-click="handleRowShow"
      @clear-search="handleClearSearch"
      @page-change="(page) => emit('pageChange', page)"
      @limit-change="(limit) => emit('limitChange', limit)"
    />
    <EmptyBlock v-else title="Aucun tag actuellement.">
      <Button variant="secondary" as-child>
        <NuxtLink to="/tags/add">Créer un tag</NuxtLink>
      </Button>
    </EmptyBlock>
  </div>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer ce tag ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
