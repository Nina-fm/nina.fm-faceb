<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const { currentUserId } = useAuthApi()
  const { fetchUsers, deleteUser } = useUserApi()
  const { data, error, refresh, status } = await useAsyncData('users', () => fetchUsers())

  const isLoading = ref(false)
  const openInviteDialog = ref(false)
  const users = computed(() => data.value?.results || [])

  const isMe = (id: string) => currentUserId.value === id

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Utilisateurs',
      },
    ],
  })

  watch(status, (newStatus) => {
    if (newStatus === 'pending') {
      isLoading.value = true
    } else {
      setTimeout(() => (isLoading.value = false), 500)
    }
  })

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des utilisateurs.')
    }
  })

  const handleRefresh = async () => {
    await refresh()
  }

  const handleSubmitInvite = async (email: string) => {
    await navigateTo('/invitations')
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
      await deleteUser(id)
      await refresh()
      toast.success('Utilisateur supprimé !')
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression de l'utilisateur.")
    }
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
    :undeletableIds="currentUserId ? [currentUserId] : []"
    @invite="openInviteDialog = true"
    @rowShow="handleRowShow"
    @rowEdit="handleEditRow"
    @rowDelete="handleDeleteRow"
  />
  <InvitationDialog v-model="openInviteDialog" @submit="handleSubmitInvite" />
  <LoadingOverlay :active="isLoading" />
</template>
