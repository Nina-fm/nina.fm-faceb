<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  const { deleteInvitation, fetchInvitations, resendInvitation } = useAuth()
  const { data, error, refresh, status } = await useAsyncData('invitations', () => fetchInvitations())

  const isLoading = ref(false)
  const invitations = computed(() => data.value?.invitations || [])

  const idToDelete = ref<string | number | null>(null)
  const openConfirm = ref(false)

  watch(status, (newStatus) => {
    if (newStatus === 'pending') {
      isLoading.value = true
    } else {
      setTimeout(() => (isLoading.value = false), 500)
    }
  })

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des invitations.')
    }
  })

  const handleRefresh = async () => {
    await refresh()
  }

  const handleSubmitInvite = async (email: string) => {
    await refresh()
    toast.success(`Invitation envoyée à ${email} !`)
  }

  const handleResend = async (id: string | number) => {
    const { email } = await resendInvitation(id)
    toast.success(`Invitation renvoyée à ${email} !`)
  }

  const handleDelete = (id: string | number) => {
    idToDelete.value = id
    openConfirm.value = true
  }

  const handleCancelDelete = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    if (idToDelete.value) {
      try {
        await deleteInvitation(idToDelete.value)
        await refresh()
        toast.success('Invitation supprimée !')
      } catch (error) {
        toast.error("Une erreur est survenue lors de la suppression de l'invitation.")
      } finally {
        openConfirm.value = false
        idToDelete.value = null
      }
    }
  }
</script>

<template>
  <PageHeader title="Invitations utilisateurs">
    <template #actions>
      <Button size="icon" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
      <InvitationDialog @submit="handleSubmitInvite">
        <Button size="icon" variant="outline">
          <PlusIcon />
        </Button>
      </InvitationDialog>
    </template>
  </PageHeader>
  <InvitationTable :data="invitations" @rowResend="handleResend" @rowDelete="handleDelete" />
  <ConfirmDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer cette invitation ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
  <LoadingOverlay :active="isLoading" />
</template>
