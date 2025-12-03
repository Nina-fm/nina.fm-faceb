<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ requiresRoles: [Role.ADMIN, Role.MANAGER] })

  const { params } = useRoute()
  const id = params.id as string
  const { getUser, updateUser, updateUserProfile } = useUserApi()
  const { uploadImage } = useImageApi()
  const { data } = getUser(id)
  const user = computed(() => data.value?.data)

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

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      // Étape 1 : Gestion de l'avatar
      let newAvatarId: string | null | undefined = undefined
      const hasNewFile =
        values.avatar &&
        typeof values.avatar === 'object' &&
        'file' in values.avatar &&
        values.avatar.file instanceof File

      if (hasNewFile) {
        // Upload du nouvel avatar dans le bucket 'avatars'
        const uploadedImage = await uploadImage.mutateAsync({
          file: values.avatar.file as File,
          bucket: 'avatars',
        })
        newAvatarId = uploadedImage.id
      } else if (values.avatar && typeof values.avatar === 'object' && !('id' in values.avatar)) {
        // L'avatar a été supprimé (pas de fichier et pas d'ID existant)
        newAvatarId = null
      }

      // Étape 2 : Mise à jour du profil (nickname, firstName, lastName, description, avatarId)
      const profilePayload: Record<string, unknown> = {
        nickname: values.nickname,
        firstName: values.firstName,
        lastName: values.lastName,
        description: values.description,
      }

      // Ajouter avatarId seulement si il a changé (upload ou suppression)
      if (newAvatarId !== undefined) {
        profilePayload.avatarId = newAvatarId
      }

      await updateUserProfile.mutateAsync({
        userId: id,
        payload: profilePayload,
      })

      // Étape 3 : Mise à jour de l'email et du rôle si modifiés
      const userPayload: Record<string, unknown> = {}
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
    :pending="updateUser.isPending.value || updateUserProfile.isPending.value || uploadImage.isPending.value"
    can-edit-roles
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
