<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ requiresRoles: [Role.ADMIN, Role.MANAGER] })

  const route = useRoute()
  const { sendInvitation, cancelInvitation, resendInvitation, getInvitations } = useInvitationApi()

  // Pagination et filtres depuis l'URL
  const page = computed(() => Number(route.query.page) || 1)
  const limit = computed(() => Number(route.query.limit) || 10)
  const search = computed(() => route.query.search?.toString())
  const statusFilter = computed(() => route.query.status as 'pending' | 'used' | 'expired' | undefined)

  // Query avec pagination et filtres
  const queryParams = computed(() => ({
    page: page.value,
    limit: limit.value,
    search: search.value || undefined,
    status: statusFilter.value,
  }))

  const { data: invitationsData, error, refetch, isPending } = getInvitations(queryParams)

  const invitations = computed(() => invitationsData.value?.data || [])

  const paginationMeta = computed(() => {
    const pagination = invitationsData.value?.pagination
    if (!pagination) return undefined

    // Ensure all required fields are present
    if (!pagination.total || !pagination.page || !pagination.limit || !pagination.totalPages) {
      return undefined
    }

    return {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      pageCount: pagination.totalPages,
    }
  })

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

  const handlePageChange = (newPage: number) => {
    const query: Record<string, string | number> = {
      page: newPage,
      limit: limit.value,
    }
    if (search.value) query.search = search.value
    if (statusFilter.value) query.status = statusFilter.value

    navigateTo({ path: '/invitations', query })
  }

  const handleLimitChange = (newLimit: number) => {
    const query: Record<string, string | number> = {
      page: 1,
      limit: newLimit,
    }
    if (search.value) query.search = search.value
    if (statusFilter.value) query.status = statusFilter.value

    navigateTo({ path: '/invitations', query })
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
    :loading="isPending"
    :server-pagination="paginationMeta"
    @invite="openInviteDialog = true"
    @row-resend="handleResendInvitation"
    @row-delete="handleDeleteInvitation"
    @page-change="handlePageChange"
    @limit-change="handleLimitChange"
  />
  <InvitationDialog v-model="openInviteDialog" @submit="handleSubmitInvite" />
</template>
