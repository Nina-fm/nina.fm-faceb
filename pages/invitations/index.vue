<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { deleteInvitation, fetchInvitations, resendInvitation } = useInvitationApi()
  const { data, error, refresh, status } = await useAsyncData('invitations', () => fetchInvitations())

  const isLoading = ref(false)
  const openInviteDialog = ref(false)
  const invitations = computed(() => data.value?.invitations || [])

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
  }

  const handleResendInvitation = async (id: string | number) => {
    const { email } = await resendInvitation(id)
    toast.success(`Invitation renvoyée à ${email} !`)
  }

  const handleDeleteInvitation = async (id: string | number) => {
    try {
      await deleteInvitation(id)
      await refresh()
      toast.success('Invitation supprimée !')
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression de l'invitation.")
    }
  }
</script>

<template>
  <PageHeader title="Invitations utilisateurs">
    <template #actions>
      <Button size="icon" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
      <Button size="icon" variant="outline" @click="openInviteDialog = true">
        <PlusIcon />
      </Button>
    </template>
  </PageHeader>
  <InvitationTable
    :data="invitations"
    @invite="openInviteDialog = true"
    @row-resend="handleResendInvitation"
    @row-delete="handleDeleteInvitation"
  />
  <InvitationDialog v-model="openInviteDialog" @submit="handleSubmitInvite" />
  <LoadingOverlay :active="isLoading" />
</template>
