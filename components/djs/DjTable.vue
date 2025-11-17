<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import type { Dj } from '~/types/api/djs.types'

  const DjTableActions = resolveComponent('DjTableActions')
  const Badge = resolveComponent('Badge')

  withDefaults(
    defineProps<{
      data?: Dj[]
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
      loading: false,
      serverPagination: undefined,
    },
  )

  const emit = defineEmits<{
    rowShowMixtapes: [name: string]
    pageChange: [page: number]
    limitChange: [limit: number]
  }>()

  const handleRowShowMixtape = (name: string) => {
    emit('rowShowMixtapes', name)
  }

  const defaultSorting = ref<SortingState>([
    {
      id: 'firstMixtapeYear',
      desc: false,
    },
  ])

  const columns: ColumnDef<Dj>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ cell }) => {
        const name = cell.getValue() as string
        return h(
          'span',
          { class: 'flex gap-3 items-center' },
          {
            default: () => [name],
          },
        )
      },
    },
    {
      accessorKey: 'firstMixtapeYear',
      header: 'Depuis',
      size: 100,
      cell: ({ cell }) => {
        const year = cell.getValue() as number | null
        return h('span', {}, year?.toString() || '–')
      },
    },
    {
      accessorKey: 'mixtapesCount',
      header: 'Mixtapes',
      size: 60,
      cell: ({ cell }) => {
        const mixtapesCount = cell.getValue()
        return h(
          'span',
          { class: 'flex gap-2' },
          {
            default: () => [
              h(
                Badge,
                {
                  variant: mixtapesCount ? 'default' : 'outline',
                },
                {
                  default: () => [mixtapesCount],
                },
              ),
            ],
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
        const name = cell.row.original.name
        return h(DjTableActions, {
          onShowMixtapes: () => handleRowShowMixtape(name),
        })
      },
    },
  ]
</script>

<template>
  <div class="py-10">
    <DataTable
      v-if="data.length || loading"
      :data="data"
      :columns="columns"
      :sorting="defaultSorting"
      :server-pagination="serverPagination"
      :loading="loading"
      search
      pagination
      background
      @page-change="(page) => emit('pageChange', page)"
      @limit-change="(limit) => emit('limitChange', limit)"
    />
    <EmptyBlock v-else title="Aucun dj actuellement." />
  </div>
</template>
