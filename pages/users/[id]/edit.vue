<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { getUserById, updateUser } = useUserApi()
  const { data, refresh } = await useAsyncData('user', () => getUserById(id))
  const user = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
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
      <Button size="icon" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <UserForm
    v-if="user"
    :user="user"
    canEditRoles
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
