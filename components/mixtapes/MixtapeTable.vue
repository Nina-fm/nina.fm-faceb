<script setup lang="ts">
  import type { ColumnDef, SortingState } from '@tanstack/vue-table'
  import { toast } from 'vue-sonner'
  import type { Mixtape } from '~/types/db'

  const ImageIcon = await import('lucide-vue-next').then((module) => module.ImageIcon)

  const Avatar = resolveComponent('Avatar')
  const AvatarFallback = resolveComponent('AvatarFallback')
  const AvatarImage = resolveComponent('AvatarImage')
  const IconBadge = resolveComponent('IconBadge')
  const MixtapesTableActions = resolveComponent('MixtapesTableActions')

  const props = withDefaults(
    defineProps<{
      data: Mixtape[]
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
      enableGlobalFilter: false,
      size: 30,
      cell: ({ cell }) => {
        const year = cell.getValue() as string
        return h('span', {}, year)
      },
    },
    {
      accessorKey: 'djsAsText',
      header: 'DJs',
    },
    {
      accessorKey: 'actions',
      header: '',
      size: 40,
      enableGlobalFilter: false,
      cell: ({ cell }) => {
        const id = cell.row.original.id.toString()
        return h(MixtapesTableActions, {
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
      search
      pagination
      background
    />
    <EmptyBlock v-else title="Aucune mixtape actuellement.">
      <Button variant="secondary" asChild>
        <NuxtLink to="/mixtapes/add">Créer une mixtape</NuxtLink>
      </Button>
    </EmptyBlock>
  </div>
  <ConfirmDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cette mixtape ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
