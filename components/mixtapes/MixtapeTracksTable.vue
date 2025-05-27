<script setup lang="ts">
  import type { ColumnDef } from '@tanstack/vue-table'
  import type { MixtapeExt } from '~/types/supatypes'

  defineProps<{
    data: MixtapeExt['tracks']
  }>()

  const columns: ColumnDef<MixtapeExt['tracks']>[] = [
    {
      accessorKey: 'position',
      header: '',
    },
    {
      accessorKey: 'artist',
      header: 'Artiste',
    },
    {
      accessorKey: 'title',
      header: 'Titre',
    },
    {
      accessorKey: 'start_at',
      header: () => h('div', { class: 'text-right' }, { default: () => ['Début'] }),
      cell: ({ cell }) => {
        const startAt = cell.getValue() as string
        return h('div', { class: 'text-right' }, { default: () => [startAt ? startAt : '—'] })
      },
    },
  ]
</script>

<template>
  <DataTable :columns="columns" :data="data" />
</template>
