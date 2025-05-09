<script setup lang="ts">
  import type { ColumnDef } from '@tanstack/vue-table'
  import type { AuthorExt } from '~/types/supatypes'

  const PencilIcon = defineAsyncComponent(() => import('lucide-vue-next').then((m) => m.PencilIcon))
  const Trash2Icon = defineAsyncComponent(() => import('lucide-vue-next').then((m) => m.Trash2Icon))

  const Badge = resolveComponent('Badge')
  const Button = resolveComponent('Button')

  defineProps<{
    data: AuthorExt[]
    loading?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'rowClick', id: string | number): void | Promise<void>
    (e: 'rowEdit', id: string | number): void | Promise<void>
    (e: 'rowDelete', id: string | number): void | Promise<void>
  }>()

  const { user } = useAuthStoreRefs()

  const isMe = (userId: string) => user.value?.id === userId

  const handleRowEdit = (event: Event, id: string | number) => {
    emit('rowEdit', id)
  }
  const handleRowDelete = (event: Event, id: string | number) => {
    emit('rowDelete', id)
  }

  const columns: ColumnDef<AuthorExt>[] = [
    {
      accessorKey: 'name',
      header: 'Nom',
    },
    {
      accessorKey: 'user_id',
      header: 'User',
      cell: ({ cell }) => {
        const userId = cell.getValue() as AuthorExt['user_id']
        return h(
          Badge,
          {
            variant: !!userId ? 'default' : 'primary',
            class: cn({
              'size-3 p-0': !userId || !isMe(userId),
            }),
          },
          userId && isMe(userId) ? 'Moi' : '',
        )
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
