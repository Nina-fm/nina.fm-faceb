<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { PencilIcon, Trash2Icon, XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const route = useRoute()
  const id = route.params.id as string
  const { getMixtape, deleteMixtape } = useMixtapeApi()
  const { data: mixtapeData } = getMixtape(id)

  const openConfirm = ref(false)
  // ✅ L'API retourne maintenant toujours { data: Mixtape } de manière cohérente
  const mixtape = computed(() => mixtapeData.value?.data)

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
      await deleteMixtape.mutateAsync(id)
      await navigateTo('/mixtapes')
    } catch {
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
