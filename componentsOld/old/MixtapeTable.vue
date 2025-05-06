<script setup lang="ts">
  import type { ColumnDef } from '@tanstack/vue-table'
  import type { MixtapeExt } from '~/types/supatypes'

  const PencilIcon = defineAsyncComponent(() => import('lucide-vue-next').then((m) => m.PencilIcon))
  const Trash2Icon = defineAsyncComponent(() => import('lucide-vue-next').then((m) => m.Trash2Icon))

  const Badge = resolveComponent('Badge')
  const Button = resolveComponent('Button')

  defineProps<{
    data: MixtapeExt[]
    loading?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'rowClick', id: string | number): void | Promise<void>
    (e: 'rowEdit', id: string | number): void | Promise<void>
    (e: 'rowDelete', id: string | number): void | Promise<void>
  }>()

  const handleRowEdit = (event: Event, id: string | number) => {
    emit('rowEdit', id)
  }
  const handleRowDelete = (event: Event, id: string | number) => {
    emit('rowDelete', id)
  }

  const columns: ColumnDef<MixtapeExt>[] = [
    {
      accessorKey: 'name',
      header: 'Mixtape',
    },
    {
      accessorKey: 'tracks',
      header: 'Pistes',
      size: 60,
      cell: ({ cell }) => {
        const tracks = cell.getValue() as MixtapeExt['tracks']
        return h(Badge, { variant: tracks.length ? 'successMuted' : 'destructiveMuted' }, tracks.length)
      },
    },
    {
      accessorKey: 'year',
      header: 'Année',
      size: 60,
    },
    {
      accessorKey: 'authors_text',
      header: 'Par',
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      size: 60,
      cell: ({ cell }) => {
        const tags = cell.getValue() as MixtapeExt['tags']
        return h(Badge, { variant: 'secondary' }, tags.length)
      },
    },
    {
      accessorKey: 'actions',
      header: () => h('span', { class: 'flex justify-end' }, 'Actions'),
      size: 60,
      cell: ({ cell }) => {
        const id = cell.row.original.id
        return h('div', { class: 'flex gap-2 justify-end' }, [
          h(
            'button',
            { onClick: (e) => handleRowEdit(e, id) },
            h(Button, { variant: 'ghost', size: 'icon' }, h(PencilIcon, { class: 'size-4' })),
          ),
          h(
            'button',
            { onClick: (e) => handleRowDelete(e, id) },
            h(Button, { variant: 'ghost', size: 'icon' }, h(Trash2Icon, { class: 'size-4' })),
          ),
        ])
      },
    },
  ]
</script>

<template>
  <div class="py-10">
    <DataTable
      :columns="columns"
      :data="data"
      :loading
      background
      pagination
      @rowClick="(id) => $emit('rowClick', id)"
    />
  </div>
</template>
