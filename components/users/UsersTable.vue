<script setup lang="ts">
  import { Role } from '@prisma/client'
  import type { ColumnDef } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { User } from '~/types/db'

  const Avatar = resolveComponent('Avatar')
  const AvatarFallback = resolveComponent('AvatarFallback')
  const AvatarImage = resolveComponent('AvatarImage')
  const RoleBadge = resolveComponent('RoleBadge')
  const UsersTableActions = resolveComponent('UsersTableActions')

  const props = withDefaults(
    defineProps<{
      data: User[]
      undeletableIds?: string[]
      loading?: boolean
    }>(),
    {
      data: () => [],
      loading: false,
    },
  )

  const emit = defineEmits<{
    invite: []
    rowEdit: [id: string]
    rowDelete: [id: string]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

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
        toast.error("Une erreur est survenue lors de la suppression de l'utilisateur.")
      } finally {
        openConfirm.value = false
      }
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: () => h('span', { class: 'pl-10' }, 'Utilisateur'),
      cell: ({ cell }) => {
        const name = cell.getValue() as string
        const avatar = cell.row.original.avatar
        const roles = cell.row.original.roles as string[]
        const isAdmin = roles.includes(Role.ADMIN)
        return h(
          'span',
          { class: 'flex gap-3 items-center' },
          {
            default: () => [
              h(
                Avatar,
                {},
                {
                  default: () => [
                    ...(avatar
                      ? [
                          h(AvatarImage, {
                            src: avatar.filename,
                            alt: avatar.alt,
                          }),
                        ]
                      : []),
                    h(AvatarFallback, {}, { default: () => [cell.row.original.name?.slice(0, 1)] }),
                  ],
                },
              ),
              name,
              ...(isAdmin ? [h(RoleBadge, { name })] : [null]),
            ],
          },
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'createdAt',
      header: 'Inscription',
      cell: ({ cell }) => {
        const createdAt = cell.getValue() as Date
        return h('span', new Date(createdAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }))
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Dernière modification',
      cell: ({ cell }) => {
        const updateddAt = cell.getValue() as Date
        return h('span', new Date(updateddAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }))
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 40,
      cell: ({ cell }) => {
        const id = cell.row.original.id.toString()
        return h(
          'div',
          { class: 'flex justify-end' },
          {
            default: () => [
              h(UsersTableActions, {
                deletable: !props.undeletableIds?.includes(id),
                onEdit: () => handleRowEdit(id),
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
    <DataTable v-if="data.length" :columns="columns" :data="data" background pagination />
    <EmptyBlock v-else title="Aucun utilisateur actuellement.">
      <Button variant="secondary" class="w-1/2" @click="$emit('invite')">Inviter un utilisateur</Button>
    </EmptyBlock>
  </div>
  <ConfirmDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
