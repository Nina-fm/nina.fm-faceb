<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { getUser, updateUser, updateUserProfile, uploadUserAvatar } = useUserApi()
  const { data } = getUser(id)
  const user = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Utilisateurs',
      },
      {
        label: user.value?.profile?.nickname ?? "Modification de l'utilisateur",
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/users')
  }

  const handleSubmit = async (values: any) => {
    try {
      // Étape 1 : Upload de l'avatar si un nouveau fichier a été fourni
      if (values.avatar?.file instanceof File) {
        await uploadUserAvatar.mutateAsync({
          userId: id,
          file: values.avatar.file,
        })
      }

      // Étape 2 : Mise à jour du profil (nickname, description)
      const profilePayload: Record<string, any> = {
        nickname: values.nickname,
        description: values.description,
      }

      await updateUserProfile.mutateAsync({
        userId: id,
        payload: profilePayload,
      })

      // Étape 3 : Mise à jour de l'email et du rôle si modifiés
      const userPayload: Record<string, any> = {}
      if (values.email !== user.value?.email) {
        userPayload.email = values.email
      }
      if (values.role && values.role !== user.value?.role) {
        userPayload.role = values.role
      }

      if (Object.keys(userPayload).length > 0) {
        await updateUser.mutateAsync({ userId: id, payload: userPayload })
      }

      toast.success('Utilisateur modifié.')
    } catch (error) {
      console.error('Error editing user:', error)
      toast.error("Erreur lors de la modification de l'utilisateur.")
    }
  }
</script>

<template>
  <PageHeader title="Modifier l'utilisateur">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <UserForm
    v-if="user"
    :user="user"
    :pending="updateUser.isPending.value || updateUserProfile.isPending.value || uploadUserAvatar.isPending.value"
    can-edit-roles
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
