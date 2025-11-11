<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({
    requiresRoles: ['ADMIN'],
  })

  const { currentUserId } = useAuthApi()
  const { getUsers, deleteUser } = useUserApi()
  const { sendInvitation } = useInvitationApi()

  // Pagination et filtres
  const currentPage = ref(1)
  const pageSize = ref(10)
  const searchQuery = ref('')
  const roleFilter = ref<Role | undefined>(undefined)

  // Query avec pagination et filtres - utilisation de computed pour la réactivité
  const queryParams = computed(() => ({
    page: currentPage.value,
    limit: pageSize.value,
    search: searchQuery.value || undefined,
    role: roleFilter.value,
  }))

  const { data: usersData, error, refetch } = getUsers(queryParams)

  const users = computed(() => usersData.value?.data || [])
  const openInviteDialog = ref(false)

  const isMe = (id: string) => currentUserId.value === id

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Utilisateurs',
      },
    ],
  })

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des utilisateurs.')
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

  const handleRowShow = (id: string) => {
    if (isMe(id)) {
      return navigateTo('/profile')
    }
    return navigateTo(`/users/${id}`)
  }

  const handleEditRow = (id: string) => {
    if (isMe(id)) {
      return navigateTo('/profile/edit')
    }
    return navigateTo(`/users/${id}/edit`)
  }

  const handleDeleteRow = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id)
      await refetch()
      toast.success('Utilisateur supprimé !')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression de l'utilisateur.",
      )
    }
  }

  const handleFilterChange = (filters: Record<string, unknown>) => {
    roleFilter.value = filters.role as Role | undefined
  }
</script>

<template>
  <PageHeader title="Les utilisateurs">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
      <Button size="fab" variant="outline" @click="openInviteDialog = true">
        <PlusIcon />
      </Button>
    </template>
  </PageHeader>
  <UsersTable
    :data="users"
    :undeletable-ids="currentUserId ? [currentUserId] : []"
    @invite="openInviteDialog = true"
    @row-show="handleRowShow"
    @row-edit="handleEditRow"
    @row-delete="handleDeleteRow"
    @filter-change="handleFilterChange"
  />
  <InvitationDialog v-model="openInviteDialog" @submit="handleSubmitInvite" />
</template>
