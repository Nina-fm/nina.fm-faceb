<script setup lang="ts">
  import type { Invitation, User } from '@prisma/client'
  import type { ColumnDef } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'

  const InvitationTableActions = resolveComponent('InvitationTableActions')

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
    invite: []
    rowResend: [id: string | number]
    rowDelete: [id: string | number]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  const handleRowResend = (id: string) => {
    emit('rowResend', id)
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
        toast.error("Une erreur est survenue lors de la suppression de l'invitation.")
      } finally {
        openConfirm.value = false
      }
    }
  }

  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ cell }) => {
        const id = cell.getValue() as string
        return h('div', { class: 'size-2 rounded-full bg-info' })
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
      header: '',
      size: 60,
      cell: ({ cell }) => {
        const id = cell.row.original.id
        return h(
          'div',
          { class: 'flex justify-end' },
          {
            default: () => [
              h(InvitationTableActions, {
                onResend: () => handleRowResend(id),
                onDelete: () => handleRowDelete(id),
              }),
            ],
          },
        )
      },
    },
  ]
</script>

<template>
  <div class="py-10">
    <DataTable v-if="data.length" :columns="columns" :data="data" background />
    <EmptyBlock v-else title="Aucune invitation en attente.">
      <Button variant="ghost" @click="navigateTo('/users')">Voir les utilisateurs</Button>
      <Button variant="secondary" @click="$emit('invite')">Inviter un utilisateur</Button>
    </EmptyBlock>
  </div>
  <ConfirmDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cette invitation ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
