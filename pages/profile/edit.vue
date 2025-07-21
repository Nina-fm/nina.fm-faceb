<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.USER, Role.ADMIN] })

  const { currentUserId, refreshSession, hasRole } = useAuthApi()
  const { getUserById, updateUser, pending } = useUserApi()
  const { data: user } = await useAsyncData('user', () => getUserById(currentUserId.value ?? ''))

  onBeforeMount(() => {
    if (hasRole(Role.USER) && user.value?.id !== currentUserId.value) {
      return navigateTo('/')
    }
  })

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Mon profil',
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/profile')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    if (!user.value?.id) {
      toast.error('Utilisateur introuvable.')
      return
    }
    try {
      await updateUser(user.value.id, values as UserUpdate)
      await refreshSession()
      toast.success('Utilisateur modifié.')
    } catch (error) {
      console.error('Error editing user:', error)
      toast.error("Erreur lors de la modification de l'utilisateur.")
    }
  }
</script>

<template>
  <PageHeader title="Modifier mon profil utilisateur">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <UserForm
    v-if="user"
    :user="user"
    teleport-to="page-header-actions"
    :can-edit-roles="false"
    :pending="pending"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
