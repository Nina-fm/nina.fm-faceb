<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import type { Dj } from '~/types/api/djs.types'

  const DjTableActions = resolveComponent('DjTableActions')
  const Badge = resolveComponent('Badge')

  withDefaults(
    defineProps<{
      data?: Dj[]
      loading?: boolean
    }>(),
    {
      data: () => [],
      loading: false,
    },
  )

  const emit = defineEmits<{
    rowShowMixtapes: [name: string]
  }>()

  const handleRowShowMixtape = (name: string) => {
    emit('rowShowMixtapes', name)
  }

  const defaultSorting = ref<SortingState>([
    {
      id: 'createdAt',
      desc: true,
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
      accessorKey: 'createdAt',
      header: 'Depuis',
      size: 150,
      cell: ({ cell }) => {
        const date = new Date(cell.getValue() as string)
        return h('span', {}, { default: () => [date.toLocaleDateString('fr-FR', { year: 'numeric' })] })
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
      v-if="data.length"
      :data="data"
      :columns="columns"
      :sorting="defaultSorting"
      search
      pagination
      background
    />
    <EmptyBlock v-else title="Aucun dj actuellement." />
  </div>
</template>
