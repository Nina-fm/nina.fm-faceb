<script setup lang="ts">
  // Types globaux depuis api.d.ts
  import type { ColumnDef } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { InvitationResponse } from '~/types/invitation'

  const InvitationTableActions = resolveComponent('InvitationTableActions')

  withDefaults(
    defineProps<{
      data?: InvitationResponse[]
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
      } catch {
        toast.error("Une erreur est survenue lors de la suppression de l'invitation.")
      } finally {
        openConfirm.value = false
      }
    }
  }

  const columns: ColumnDef<InvitationResponse>[] = [
    {
      accessorKey: 'id',
      header: '',
      size: 60,
      cell: () => {
        return h('div', { class: 'size-2 rounded-full bg-info' })
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorFn: (row) => {
        // DEBUG: log structure de la ligne
        if (typeof window !== 'undefined') {
          console.log('Invitation row:', row)
        }
        return row.createdAt
      },
      id: 'created_at',
      header: "Date d'invitation",
      cell: ({ row }) => {
        const createdAt = row.original.createdAt
        const date = createdAt ? new Date(createdAt) : null
        return h(
          'span',
          {},
          {
            default: () => [
              date && !isNaN(date.getTime()) ? date.toLocaleDateString('fr-FR', { dateStyle: 'medium' }) : '',
            ],
          },
        )
      },
    },
    {
      accessorFn: (row) => {
        if (typeof window !== 'undefined') {
          console.log('Invitation row (invitedBy):', row)
        }
        return row.invitedBy
      },
      id: 'invitedBy',
      header: 'Invité par',
      cell: ({ row }) => {
        const email = row.original.invitedBy
        return h('span', {}, { default: () => [email || ''] })
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
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cette invitation ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
