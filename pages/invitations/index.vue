<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { sendInvitation, cancelInvitation, resendInvitation, getInvitations, canManageInvitations } =
    useInvitationApi()

  // Pagination et filtres
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')
  const statusFilter = ref<'pending' | 'used' | 'expired' | undefined>(undefined)

  // Query avec pagination et filtres - utilisation de computed pour la réactivité
  const queryParams = computed(() => ({
    page: currentPage.value,
    limit: pageSize.value,
    search: searchQuery.value || undefined,
    status: statusFilter.value,
  }))

  const { data: invitationsData, error, refetch } = getInvitations(queryParams)

  const invitations = computed(() => invitationsData.value?.data || [])
  const openInviteDialog = ref(false)

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des invitations.')
    }
  })

  const handleRefresh = async () => {
    await refetch()
  }

  const handleSubmitInvite = async ({ email, message }: { email: string; message?: string }) => {
    try {
      await sendInvitation.mutateAsync({ email, message })
      toast.success(`Invitation envoyée à ${email} !`)
      openInviteDialog.value = false
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi de l'invitation."
      toast.error(errorMessage)
    }
  }

  // Adapter les signatures pour correspondre aux attentes des composants
  const handleResendInvitation = async (id: string | number) => {
    // Pour l'instant, on va juste récupérer l'email depuis les données
    const invitation = invitations.value.find((inv) => inv.id === String(id))
    if (!invitation) return

    try {
      await resendInvitation.mutateAsync({
        invitationId: String(id),
        email: invitation.email,
      })
      toast.success(`Invitation renvoyée à ${invitation.email} !`)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue lors du renvoi de l'invitation."
      toast.error(errorMessage)
    }
  }

  const handleDeleteInvitation = async (id: string | number) => {
    try {
      await cancelInvitation.mutateAsync(String(id))
      toast.success('Invitation supprimée !')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression de l'invitation."
      toast.error(errorMessage)
    }
  }

  // Vérification des permissions
  if (!canManageInvitations.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès non autorisé - Rôle administrateur requis',
    })
  }
</script>

<template>
  <PageHeader title="Les invitations en attente">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
      <Button size="fab" variant="outline" @click="openInviteDialog = true">
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
</template>
