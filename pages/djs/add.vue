<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { createDj } = useDjApi()

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
      await createDj(values as DjEdit)
      toast.success('Dj créé.')
      await navigateTo('/djs')
    } catch (error) {
      console.error('Error creating dj:', error)
      toast.error('Erreur lors de la création du dj.')
    }
  }
</script>

<template>
  <PageHeader title="Nouveau dj">
    <template #actions>
      <Button size="icon" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <DjForm teleport-to="page-header-actions" @cancel="handleCancel" @submit="handleSubmit" />
</template>
