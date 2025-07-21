<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { getUserById, updateUser, pending } = useUserApi()
  const { data, refresh } = await useAsyncData('user', () => getUserById(id))
  const user = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Utilisateurs',
      },
      {
        label: user.value?.name ?? "Modification de l'utilisateur",
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/users')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await updateUser(id, values as UserUpdate)
      await refresh()
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
    :pending="pending"
    can-edit-roles
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
