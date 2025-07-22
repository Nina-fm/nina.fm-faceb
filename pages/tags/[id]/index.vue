<script lang="ts" setup>
  import { PencilIcon, Trash2Icon, XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import { Role } from '~/utils/roles'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { getTagById, deleteTag } = useTagApi()
  const { data } = await useAsyncData('tag', () => getTagById(id))

  const openConfirm = ref(false)
  const tag = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: tag.value?.name ?? 'Détails du Tag',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/tags')
  }

  const handleDelete = () => {
    openConfirm.value = true
  }

  const handleCancelDelete = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteTag(id)
      await navigateTo('/tags')
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression du tag.')
    } finally {
      openConfirm.value = false
    }
  }
</script>

<template>
  <PageHeader title="Le Tag en détails">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
      <Button size="fab" variant="destructiveOutline" @click="handleDelete">
        <Trash2Icon />
      </Button>
      <Button size="fab" variant="outline">
        <NuxtLink :to="`/tags/${id}/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer le tag ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
  <TagDetails v-if="tag" :tag="tag" />
</template>
