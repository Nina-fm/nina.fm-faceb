<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { FilterDef } from '~/components/ui/data-table'
  import type { User } from '~/types/api/users.types'

  const UserRoundIcon = await import('lucide-vue-next').then((module) => module.UserRoundIcon)
  const ShieldUserIcon = await import('lucide-vue-next').then((module) => module.ShieldUserIcon)

  const Avatar = resolveComponent('Avatar')
  const AvatarFallback = resolveComponent('AvatarFallback')
  const AvatarImage = resolveComponent('AvatarImage')
  const Badge = resolveComponent('Badge')
  const UsersTableActions = resolveComponent('UsersTableActions')

  const props = withDefaults(
    defineProps<{
      data: User[]
      loading?: boolean
      undeletableIds?: string[]
      uneditableIds?: string[]
    }>(),
    {
      loading: false,
      undeletableIds: () => [],
      uneditableIds: () => [],
    },
  )

  const emit = defineEmits<{
    invite: []
    rowShow: [id: string]
    rowEdit: [id: string]
    rowDelete: [id: string]
    filterChange: [filters: Record<string, unknown>]
  }>()

  const { getThumbnailUrl } = useImageApi()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  const roleFilterOptions = computed(() => {
    return [
      { label: 'Administrateur', value: Role.ADMIN },
      { label: 'Responsable', value: Role.MANAGER },
      { label: 'Contributeur', value: Role.CONTRIBUTOR },
      { label: 'Utilisateur', value: Role.VIEWER },
    ]
  })

  const filters: FilterDef[] = [
    {
      id: 'role',
      label: 'Rôles',
      options: roleFilterOptions.value,
      multiple: false,
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
        const profile = cell.row.original.profile
        const name = profile?.nickname || cell.row.original.email
        const avatarUrl = profile?.avatar ? getThumbnailUrl(profile.avatar) : null
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
                    ...(avatarUrl
                      ? [
                          h(AvatarImage, {
                            src: avatarUrl,
                            alt: name,
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
      accessorKey: 'role',
      header: '',
      cell: ({ cell }) => {
        const role = cell.getValue() as string
        const isAdmin = role === Role.ADMIN
        const roleOption = roleFilterOptions.value.find((o) => o.value === role)
        const roleLabel = roleOption?.label || 'Inconnu'
        return isAdmin
          ? [
              h(
                Badge,
                { variant: isAdmin ? 'successMuted' : 'infoMuted' },
                {
                  default: () => (isAdmin ? [h(ShieldUserIcon), roleLabel] : [roleLabel]),
                },
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
        const createdAt = cell.getValue() as string | Date
        return h('span', {}, new Date(createdAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }))
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Dernière modification',
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const updatedAt = cell.getValue() as string | Date
        return h('span', {}, new Date(updatedAt).toLocaleDateString('fr-FR', { dateStyle: 'medium' }))
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
          deletable: !props.undeletableIds.includes(id),
          editable: !props.uneditableIds.includes(id),
          onShow: () => handleRowShow(id),
          onEdit: () => handleRowEdit(id),
          onDelete: () => handleRowDelete(id),
        })
      },
    },
  ]

  const handleRowShow = (id: string | number) => {
    emit('rowShow', id.toString())
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
        toast.error(
          error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression de l'utilisateur.",
        )
      } finally {
        openConfirm.value = false
      }
    }
  }

  const handleFilterChange = (filters: { id: string; value: unknown }[]) => {
    const filtersObj = filters.reduce(
      (acc, filter) => {
        acc[filter.id] = filter.value
        return acc
      },
      {} as Record<string, unknown>,
    )
    emit('filterChange', filtersObj)
  }
</script>

<template>
  <div class="py-10">
    <DataTable
      :data="data"
      :columns="columns"
      :sorting="defaultSorting"
      :filters="filters"
      search
      pagination
      background
      empty-text="Aucun utilisateur ne correspond aux critères de recherche."
      @row-click="handleRowShow"
      @filter-change="handleFilterChange"
    />
  </div>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
