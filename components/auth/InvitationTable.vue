<script setup lang="ts">
  import type { Invitation, User } from '@prisma/client'
  import type { ColumnDef } from '@tanstack/vue-table'
  import { SendIcon } from 'lucide-vue-next'
  import { defineEmits } from 'vue'

  const Trash2Icon = defineAsyncComponent(() => import('lucide-vue-next').then((m) => m.Trash2Icon))

  const Button = resolveComponent('Button')

  withDefaults(
    defineProps<{
      data: Invitation[]
      loading?: boolean
    }>(),
    {
      data: () => [],
      loading: false,
    },
  )

  const emit = defineEmits<{
    (e: 'rowResend', id: string | number): void | Promise<void>
    (e: 'rowDelete', id: string | number): void | Promise<void>
  }>()

  const handleRowResend = (event: Event, id: string | number) => {
    emit('rowResend', id)
  }

  const handleRowDelete = (event: Event, id: string | number) => {
    emit('rowDelete', id)
  }

  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ cell }) => {
        const id = cell.getValue() as string
        return h('div', { class: 'size-2 rounded-full bg-success' })
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'createdAt',
      header: "Date d'invitation",
      cell: ({ cell }) => {
        const createdAt = cell.getValue() as Date
        return h('span', new Date(createdAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }))
      },
    },
    {
      accessorKey: 'invitedBy',
      header: 'Invité par',
      cell: ({ cell }) => {
        const invitedBy = cell.getValue() as User
        return h('span', invitedBy.name || invitedBy.email)
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
            { onClick: (e) => handleRowResend(e, id) },
            h(
              Button,
              { variant: 'ghost', size: 'icon', class: 'text-muted-foreground/50' },
              h(SendIcon, { class: 'size-4' }),
            ),
          ),
          h(
            'button',
            { onClick: (e) => handleRowDelete(e, id) },
            h(
              Button,
              { variant: 'ghost', size: 'icon', class: 'text-muted-foreground/50' },
              h(Trash2Icon, { class: 'size-4' }),
            ),
          ),
        ])
      },
    },
  ]
</script>

<template>
  <div class="py-10">
    <DataTable :columns="columns" :data="data" :loading emptyText="Aucune invitation en cours." background pagination />
  </div>
</template>
