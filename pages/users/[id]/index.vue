<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { PencilIcon, Trash2Icon, XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { currentUserId } = useAuthApi()
  const { getUserById, deleteUser } = useUserApi()
  const { data } = await useAsyncData('user', () => getUserById(id))

  const openConfirm = ref(false)
  const user = computed(() => data.value)
  const isMe = computed(() => currentUserId.value === user.value?.id)

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Utilisateurs',
      },
      {
        label: user.value?.name ?? "Détails de l'utilisateur",
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/users')
  }

  const handleDelete = () => {
    openConfirm.value = true
  }

  const handleCancelDelete = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(id)
      await navigateTo('/users')
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression de l'utilisateur.")
    } finally {
      openConfirm.value = false
    }
  }
</script>

<template>
  <PageHeader title="L'utilisateur en détails">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
      <Button v-if="!isMe" size="fab" variant="destructiveOutline" @click="handleDelete">
        <Trash2Icon />
      </Button>
      <Button size="fab" variant="outline">
        <NuxtLink :to="`/users/${id}/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <ConfirmDeleteDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer l'utilisateur ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
  <UserDetails v-if="user" :user="user" />
</template>
