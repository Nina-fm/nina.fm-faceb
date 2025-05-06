<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { PencilIcon, Trash2Icon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { getDjById, deleteDj } = useDjApi()
  const { data } = await useAsyncData('dj', () => getDjById(id))

  const openConfirm = ref(false)
  const dj = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: dj.value?.name ?? 'Détails du Dj',
      },
    ],
  })

  const handleDelete = () => {
    openConfirm.value = true
  }

  const handleCancelDelete = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteDj(id)
      navigateTo('/djs')
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression du dj.')
    } finally {
      openConfirm.value = false
    }
  }
</script>

<template>
  <PageHeader title="Le Dj en détails">
    <template #actions>
      <Button size="icon" variant="destructiveOutline" @click="handleDelete">
        <Trash2Icon />
      </Button>
      <Button size="icon" variant="outline">
        <NuxtLink :to="`/djs/${id}/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <ConfirmDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer le dj ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
  <DjDetails v-if="dj" :dj="dj" />
</template>
