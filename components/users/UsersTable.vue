<script setup lang="ts">
  import { Role } from '@prisma/client'
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { FilterDef } from '~/components/ui/data-table'
  import type { User } from '~/types/db'

  const UserRoundIcon = await import('lucide-vue-next').then((module) => module.UserRoundIcon)
  const ShieldUserIcon = await import('lucide-vue-next').then((module) => module.ShieldUserIcon)

  const Avatar = resolveComponent('Avatar')
  const AvatarFallback = resolveComponent('AvatarFallback')
  const AvatarImage = resolveComponent('AvatarImage')
  const IconBadge = resolveComponent('IconBadge')
  const UsersTableActions = resolveComponent('UsersTableActions')

  const props = withDefaults(
    defineProps<{
      data: User[]
      loading?: boolean
      undeletableIds?: string[]
    }>(),
    {
      data: () => [],
      loading: false,
    },
  )

  const emit = defineEmits<{
    invite: []
    rowShow: [id: string]
    rowEdit: [id: string]
    rowDelete: [id: string]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  const roleFilterOptions = computed(() => {
    return [
      { label: 'Administrateur', value: Role.ADMIN },
      { label: 'Utilisateur', value: Role.USER },
    ]
  })

  const filters: FilterDef[] = [
    {
      id: 'roles',
      label: 'Rôles',
      options: roleFilterOptions.value,
      multiple: true,
    },
  ]

  const defaultSorting = ref<SortingState>([
    {
      id: 'createdAt',
      desc: true,
    },
  ])

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Utilisateur',
      cell: ({ cell }) => {
        const name = cell.getValue() as string
        const avatar = cell.row.original.avatar
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
                            src: avatar.url,
                            alt: avatar.alt,
                          }),
                        ]
                      : []),
                    h(
                      AvatarFallback,
                      { class: 'rounded-sm' },
                      { default: () => [h(UserRoundIcon, { class: 'size-4 text-muted-foreground' })] },
                    ),
                  ],
                },
              ),
              name,
            ],
          },
        )
      },
    },
    {
      accessorKey: 'roles',
      header: '',
      cell: ({ cell }) => {
        const roles = cell.getValue() as string[]
        const name = cell.row.original.name
        const isAdmin = roles.includes(Role.ADMIN)
        return isAdmin
          ? [
              h(
                IconBadge,
                { variant: 'successMuted', label: `${name} est Administrateur` },
                { default: () => [h(ShieldUserIcon)] },
              ),
            ]
          : null
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'createdAt',
      header: 'Inscription',
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const createdAt = cell.getValue() as Date
        return h('span', { default: () => [new Date(createdAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' })] })
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Dernière modification',
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const updateddAt = cell.getValue() as Date
        return h('span', { default: () => [new Date(updateddAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' })] })
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 40,
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const id = cell.row.original.id.toString()
        return h(UsersTableActions, {
          deletable: !props.undeletableIds?.includes(id),
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
        toast.error("Une erreur est survenue lors de la suppression de l'utilisateur.")
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
      :filters="filters"
      search
      pagination
      background
    />
    <EmptyBlock v-else title="Aucun utilisateur actuellement.">
      <Button variant="secondary" class="w-fit" @click="$emit('invite')">Inviter un utilisateur</Button>
    </EmptyBlock>
  </div>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
