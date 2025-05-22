<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { Dj } from '~/types/db'

  const FingerprintIcon = await import('lucide-vue-next').then((module) => module.FingerprintIcon)

  const IconBadge = resolveComponent('IconBadge')
  const DjsTableActions = resolveComponent('DjsTableActions')

  const props = withDefaults(
    defineProps<{
      data: Dj[]
      loading?: boolean
      currentUserId?: string
    }>(),
    {
      data: () => [],
      loading: false,
    },
  )

  const emit = defineEmits<{
    rowShow: [id: string]
    rowEdit: [id: string]
    rowDelete: [id: string]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  const defaultSorting = ref<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ])

  const columns: ColumnDef<Dj>[] = [
    {
      accessorKey: 'name',
      header: 'Dj',
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
      accessorKey: 'userId',
      header: 'Utilisateur',
      cell: ({ cell }) => {
        const userId = cell.getValue() as string
        const isCurrentUser = userId === props.currentUserId
        return userId
          ? h(
              IconBadge,
              {
                variant: isCurrentUser ? 'default' : 'secondary',
                label: isCurrentUser ? 'Moi' : userId,
              },
              { default: () => h(FingerprintIcon) },
            )
          : null
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Création',
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const createdAt = cell.getValue() as Date
        return h('span', new Date(createdAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }))
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Dernière modification',
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const updateddAt = cell.getValue() as Date
        return h('span', new Date(updateddAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }))
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 40,
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const id = cell.row.original.id.toString()
        return h(DjsTableActions, {
          onShow: () => handleRowShow(id),
          onEdit: () => handleRowEdit(id),
          onDelete: () => handleRowDelete(id),
        })
      },
    },
  ]

  const handleRowShow = (id: string) => {
    emit('rowShow', id)
  }

  const handleRowEdit = (id: string) => {
    emit('rowEdit', id)
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
      } catch (error) {
        toast.error('Une erreur est survenue lors de la suppression du dj.')
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
      search
      pagination
      background
    />
    <EmptyBlock v-else title="Aucun dj actuellement.">
      <Button variant="secondary" asChild>
        <NuxtLink to="/djs/add">Créer un Dj</NuxtLink>
      </Button>
    </EmptyBlock>
  </div>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer ce dj ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
