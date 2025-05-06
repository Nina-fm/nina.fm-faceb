<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const { user } = useAuthApi()
  const { fetchUsers, deleteUser } = useUserApi()
  const { data, error, refresh, status } = await useAsyncData('users', () => fetchUsers())

  const isLoading = ref(false)
  const openInviteDialog = ref(false)
  const users = computed(() => data.value?.results || [])

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

  const handleEditRow = (id: string) => {
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
  <PageHeader title="Utilisateurs">
    <template #actions>
      <Button size="icon" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
      <Button size="icon" variant="outline" @click="openInviteDialog = true">
        <PlusIcon />
      </Button>
    </template>
  </PageHeader>
  <UsersTable
    :data="users"
    :undeletableIds="user?.id ? [user.id] : []"
    @invite="openInviteDialog = true"
    @row-edit="handleEditRow"
    @row-delete="handleDeleteRow"
  />
  <InvitationDialog v-model="openInviteDialog" @submit="handleSubmitInvite" />
  <LoadingOverlay :active="isLoading" />
</template>
