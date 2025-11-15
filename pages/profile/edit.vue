<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR, Role.VIEWER] })

  const { user: currentUser } = useAuth()
  const currentUserId = computed(() => currentUser.value?.id || null)
  const { isViewer, isAdmin } = usePermissions()
  const { getUser, updateUser, uploadUserAvatar, updateUserProfile } = useUserApi()

  // S'assurer que currentUserId est défini avant de récupérer l'utilisateur
  if (!currentUserId.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Utilisateur non connecté',
    })
  }

  const { data: user, isLoading: pending } = getUser(currentUserId.value)

  // Extraire le user data de la réponse API
  const userData = computed(() => user.value?.data)

  // Watcher pour vérifier les permissions une fois que l'utilisateur est chargé
  watch(
    userData,
    (userValue) => {
      console.log('[PROFILE/EDIT] watch user - Debug:', {
        hasViewerRole: isViewer.value,
        hasAdminRole: isAdmin.value,
        userId: userValue?.id,
        currentUserId: currentUserId.value,
        areEqual: userValue?.id === currentUserId.value,
        userDataExists: !!userValue,
      })

      // Si on a les données utilisateur et que c'est un VIEWER qui tente de modifier un autre profil
      if (userValue && isViewer.value && userValue.id !== currentUserId.value) {
        console.log('[PROFILE/EDIT] Redirection vers / - utilisateur VIEWER tentant de modifier un autre profil')
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
      // Étape 1 : Upload de l'avatar si un nouveau fichier a été fourni
      if (values.avatar?.file instanceof File) {
        await uploadUserAvatar.mutateAsync({
          userId: userData.value.id,
          file: values.avatar.file,
        })
      }

      // Étape 2 : Mise à jour du profil (nickname, description)
      const profilePayload: Record<string, unknown> = {
        nickname: values.nickname,
        description: values.description,
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

      // Refresh user data
      window.location.reload()
      toast.success('Profil modifié avec succès.')
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
    :user="userData"
    teleport-to="page-header-actions"
    :can-edit-roles="false"
    :pending="pending"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
