<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { createDj, pending } = useDjApi()
  const { user: currentUser } = useAuthApi()

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: 'Nouveau dj',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/djs')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const dj = await createDj(values as DjEdit)
      toast.success('Dj créé.')
      await navigateTo(`/djs/${dj.id}/edit`)
    } catch (error) {
      console.error('Error creating dj:', error)
      toast.error('Erreur lors de la création du dj.')
    }
  }
</script>

<template>
  <PageHeader title="Nouveau dj">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <DjForm
    teleport-to="page-header-actions"
    :currentUserId="currentUser?.id"
    :pending="pending"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
