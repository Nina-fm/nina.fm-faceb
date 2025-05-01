<script lang="ts" setup>
  import { PencilIcon, Trash2Icon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  const { params } = useRoute()
  const id = params.id as string
  const { getUserById, deleteUser } = useUserApi()
  const { data } = await useAsyncData('user', () => getUserById(id))

  const openConfirm = ref(false)
  const user = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: user.value?.name ?? "Détails de l'utilisateur",
      },
    ],
  })

  const handleDelete = () => {
    openConfirm.value = true
  }

  const handleCancelDelete = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(id)
      navigateTo('/users')
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
      <Button size="icon" variant="destructiveOutline" @click="handleDelete">
        <Trash2Icon />
      </Button>
      <Button size="icon" variant="outline">
        <NuxtLink :to="`/users/${id}/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <ConfirmDialog
    v-model="openConfirm"
    title="Attention ! Suppression définitive"
    description="Êtes-vous sûr de vouloir supprimer l'utilisateur ?"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
  <UserDetails v-if="user" :user="user" />
</template>
