<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { PencilIcon, Trash2Icon, XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { getMixtapeById, deleteMixtape } = useMixtapeApi()
  const { data } = await useAsyncData('mixtape', () => getMixtapeById(id))

  const openConfirm = ref(false)
  const mixtape = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: mixtape.value?.name ?? 'Détails de la Mixtape',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/mixtapes')
  }

  const handleDelete = () => {
    openConfirm.value = true
  }

  const handleCancelDelete = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteMixtape(id)
      await navigateTo('/mixtapes')
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression de la mixtape.')
    } finally {
      openConfirm.value = false
    }
  }
</script>

<template>
  <PageHeader title="La Mixtape en détails">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
      <Button size="fab" variant="destructiveOutline" @click="handleDelete">
        <Trash2Icon />
      </Button>
      <Button size="fab" variant="outline">
        <NuxtLink :to="`/mixtapes/${id}/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer la mixtape ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
  <MixtapeDetails v-if="mixtape" :mixtape="mixtape" />
</template>
