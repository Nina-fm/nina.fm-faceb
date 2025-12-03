<script setup lang="ts">
  // Types globaux depuis api.d.ts
  import type { ColumnDef } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { Invitation, InvitationsListResponseDto } from '~/types/api/invitations.types'

  const InvitationTableActions = resolveComponent('InvitationTableActions')
  const InvitationStatus = resolveComponent('InvitationStatus')

  withDefaults(
    defineProps<{
      data?: InvitationsListResponseDto['data']
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
    invite: []
    rowResend: [id: string | number]
    rowDelete: [id: string | number]
    pageChange: [page: number]
    limitChange: [limit: number]
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

  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: 'id',
      header: '',
      size: 60,
      cell: ({ row }) => {
        const usedAt = row.original.usedAt
        const expiresAt = row.original.expiresAt
        return h(InvitationStatus, { usedAt, expiresAt })
      },
    },
    {
      accessorKey: 'email',
      header: 'Invitation envoyée à',
    },
    {
      accessorFn: (row) => {
        return row.invitedBy
      },
      id: 'invitedBy',
      header: 'Par',
      cell: ({ row }) => {
        const displayName = row.original.invitedBy?.profile?.nickname
          ? row.original.invitedBy.profile.nickname
          : row.original.invitedBy?.email
        return h('span', {}, { default: () => [displayName || ''] })
      },
    },
    {
      accessorFn: (row) => {
        return row.createdAt
      },
      id: 'createdAt',
      header: 'Le',
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
      accessorKey: 'actions',
      header: '',
      size: 60,
      cell: ({ cell }) => {
        const id = cell.row.original.id
        const status = getInvitationStatus(cell.row.original.usedAt, cell.row.original.expiresAt)
        return status === 'accepted'
          ? null
          : h(
              'div',
              { class: 'flex justify-end' },
              {
                default: () => [
                  h(InvitationTableActions, {
                    deletable: status === 'pending',
                    sendable: status === 'pending',
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
    <DataTable
      v-if="data.length || loading"
      :columns="columns"
      :data="data"
      :server-pagination="serverPagination"
      :loading="loading"
      pagination
      background
      @page-change="(page) => emit('pageChange', page)"
      @limit-change="(limit) => emit('limitChange', limit)"
    />
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
