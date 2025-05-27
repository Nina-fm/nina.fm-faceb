<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { Mixtape, Tag } from '~/types/db'

  const ImageIcon = await import('lucide-vue-next').then((module) => module.ImageIcon)

  const Avatar = resolveComponent('Avatar')
  const AvatarFallback = resolveComponent('AvatarFallback')
  const AvatarImage = resolveComponent('AvatarImage')
  const Badge = resolveComponent('Badge')
  const MixtapeTableActions = resolveComponent('MixtapeTableActions')

  const props = withDefaults(
    defineProps<{
      data: Mixtape[]
      searchValue?: string | number
      loading?: boolean
      currentUserId?: string
    }>(),
    {
      data: () => [],
      loading: false,
    },
  )

  const emit = defineEmits<{
    clearSearch: []
    rowShow: [id: string]
    rowEdit: [id: string]
    rowDelete: [id: string]
  }>()

  const openConfirm = ref(false)
  const idToDelete = ref<string>()

  const defaultSorting = ref<SortingState>([
    {
      id: 'year',
      desc: true,
    },
  ])

  const columns: ColumnDef<Mixtape>[] = [
    {
      accessorKey: 'name',
      header: 'Mixtape',
      cell: ({ cell }) => {
        const name = cell.getValue() as string
        const cover = cell.row.original.cover
        return h(
          'span',
          { class: 'flex gap-3 items-center' },
          {
            default: () => [
              h(
                Avatar,
                { class: 'rounded-sm' },
                {
                  default: () => [
                    ...(cover
                      ? [
                          h(AvatarImage, {
                            src: cover.url,
                            alt: cover.alt,
                          }),
                        ]
                      : []),
                    h(
                      AvatarFallback,
                      { class: 'rounded-sm' },
                      { default: () => [h(ImageIcon, { class: 'size-4 text-muted-foreground' })] },
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
      accessorKey: 'year',
      header: 'Création',
      size: 30,
      cell: ({ cell }) => {
        const year = cell.getValue() as string
        return h('span', {}, { default: () => [year] })
      },
    },
    {
      accessorKey: 'djsAsText',
      header: 'DJs',
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      size: 30,
      cell: ({ cell }) => {
        const tagsCount = (cell.getValue() as Tag[])?.length ?? 0
        return h(Badge, { variant: tagsCount ? 'infoMuted' : 'outline' }, { default: () => [tagsCount] })
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 40,
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const id = cell.row.original.id.toString()
        return h(MixtapeTableActions, {
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

  const handleClearSearch = () => {
    emit('clearSearch')
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
        toast.error('Une erreur est survenue lors de la suppression de la mixtape.')
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
      :searchValue="searchValue"
      search
      pagination
      background
      @clearSearch="handleClearSearch"
    />
    <EmptyBlock v-else title="Aucune mixtape actuellement.">
      <Button variant="secondary" asChild>
        <NuxtLink to="/mixtapes/add">Créer une mixtape</NuxtLink>
      </Button>
    </EmptyBlock>
  </div>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cette mixtape ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
