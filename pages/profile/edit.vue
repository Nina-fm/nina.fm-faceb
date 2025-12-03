<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ requiresRoles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR, Role.VIEWER] })

  const { user: currentUser, fetchUser } = useAuth()
  const currentUserId = computed(() => currentUser.value?.id || '')
  const { isViewer, isAdmin } = usePermissions()
  const { getUser, updateUser, updateUserProfile } = useUserApi()
  const { uploadImage } = useImageApi()

  // Attendre que l'utilisateur soit chargé avant de faire la requête
  const { data: user, isLoading: pending } = getUser(currentUserId)

  // Extraire le user data de la réponse API
  const userData = computed(() => user.value?.data)

  // Watcher pour vérifier les permissions une fois que l'utilisateur est chargé
  watch(
    userData,
    (userValue) => {
      // Si on a les données utilisateur et que c'est un VIEWER qui tente de modifier un autre profil
      if (userValue && isViewer.value && userValue.id !== currentUserId.value) {
        return navigateTo('/')
      }
    },
    { immediate: true },
  )

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

  // Référence au composant UserForm pour pouvoir reset le formulaire
  const userFormRef = ref<{ resetForm?: () => void }>()

  const handleCancel = async () => {
    await navigateTo('/profile')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: Record<string, any>) => {
    if (!userData.value?.id) {
      toast.error('Utilisateur introuvable.')
      return
    }
    try {
      // Étape 1 : Gestion de l'avatar
      let newAvatarId: string | null | undefined = undefined
      const hasNewFile = values.avatar?.file instanceof File

      if (hasNewFile) {
        // Upload du nouvel avatar dans le bucket 'avatars'
        const uploadedImage = await uploadImage.mutateAsync({
          file: values.avatar.file,
          bucket: 'avatars',
        })
        newAvatarId = uploadedImage.id
      } else if (!values.avatar?.id) {
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
      // L'API backend se chargera de supprimer l'ancien avatar si nécessaire
      if (newAvatarId !== undefined) {
        profilePayload.avatarId = newAvatarId
      }

      await updateUserProfile.mutateAsync({
        userId: userData.value.id,
        payload: profilePayload,
      })

      // Étape 3 : Mise à jour de l'email et du rôle si modifiés
      const userPayload: Record<string, unknown> = {}
      if (values.email !== userData.value.email) {
        userPayload.email = values.email
      }
      if (values.role && values.role !== userData.value.role) {
        userPayload.role = values.role
      }

      if (Object.keys(userPayload).length > 0) {
        await updateUser.mutateAsync({ userId: userData.value.id, payload: userPayload })
      }

      toast.success('Profil modifié avec succès.')

      // Rafraîchir le user dans useAuth pour mettre à jour le menu
      await fetchUser()

      // Reset le formulaire pour éviter l'alerte de navigation
      // TanStack Query va automatiquement refetch les données
      if (userFormRef.value?.resetForm) {
        userFormRef.value.resetForm()
      }

      // Rediriger vers la page de profil
      await navigateTo('/profile')
    } catch (error) {
      console.error('Error editing user:', error)
      toast.error('Erreur lors de la modification du profil.')
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
    v-if="userData"
    ref="userFormRef"
    :user="userData"
    teleport-to="page-header-actions"
    :can-edit-roles="false"
    :pending="pending"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
