<script lang="ts" setup>
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  const { user } = useAuth()
  const { editUser } = useUserApi()

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
      await editUser(user.value.id, values as UserEdit)
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
      <Button size="icon" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <UserEditForm
    v-if="user"
    :user="user"
    teleport-to="page-header-actions"
    :canEditRoles="false"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
