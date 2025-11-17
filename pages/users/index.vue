<script lang="ts" setup>
  import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import type { Role } from '~/types/api/users.types'

  definePageMeta({
    requiresRoles: ['ADMIN', 'MANAGER'],
  })

  const route = useRoute()
  const { user } = useAuth()
  const currentUserId = computed(() => user.value?.id || null)
  const { getUsers, deleteUser } = useUserApi()
  const { sendInvitation } = useInvitationApi()
  const { canEditUser } = usePermissions()

  // Query params
  const page = computed(() => Number(route.query.page) || 1)
  const limit = computed(() => Number(route.query.limit) || 10)
  const search = computed(() => route.query.search?.toString())
  const roleFilter = computed(() => route.query.role as Role | undefined)

  // Query avec pagination et filtres
  const queryParams = computed(() => ({
    page: page.value,
    limit: limit.value,
    search: search.value,
    role: roleFilter.value,
  }))

  const { data: usersData, error, refetch, isPending } = getUsers(queryParams)

  const users = computed(() => usersData.value?.data || [])

  const paginationMeta = computed(() => {
    const pagination = usersData.value?.pagination
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

  // Utilisateurs non-éditables pour un MANAGER
  // MANAGER ne peut éditer que VIEWER et CONTRIBUTOR (pas ADMIN ni MANAGER)
  const uneditableIds = computed(() => {
    return users.value.filter((u) => !canEditUser(u.role)).map((u) => u.id)
  })

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
    navigateTo({
      query: {
        ...route.query,
        role: filters.role as Role | undefined,
        page: '1', // Reset to page 1 when filtering
      },
    })
  }

  const handlePageChange = (page: number) => {
    const query: Record<string, string | number> = {
      page,
      limit: limit.value,
    }
    if (search.value) query.search = search.value
    if (roleFilter.value) query.role = roleFilter.value

    navigateTo({ path: '/users', query })
  }

  const handleLimitChange = (newLimit: number) => {
    const query: Record<string, string | number> = {
      page: 1,
      limit: newLimit,
    }
    if (search.value) query.search = search.value
    if (roleFilter.value) query.role = roleFilter.value

    navigateTo({ path: '/users', query })
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
    :uneditable-ids="uneditableIds"
    :server-pagination="paginationMeta"
    :loading="isPending"
    @invite="openInviteDialog = true"
    @row-show="handleRowShow"
    @row-edit="handleEditRow"
    @row-delete="handleDeleteRow"
    @filter-change="handleFilterChange"
    @page-change="handlePageChange"
    @limit-change="handleLimitChange"
  />
  <InvitationDialog v-model="openInviteDialog" @submit="handleSubmitInvite" />
</template>
