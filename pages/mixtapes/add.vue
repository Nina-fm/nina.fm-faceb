<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { createMixtape } = useMixtapeApi()

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: 'Nouvelle mixtape',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/mixtapes')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const mixtape = await createMixtape(values as MixtapeCreate)
      if (mixtape) {
        toast.success('Mixtape créée.')
        await navigateTo(`/mixtapes/${mixtape.id}/edit`)
      }
    } catch (error) {
      console.error('Error creating mixtape:', error)
      toast.error('Erreur lors de la création de la mixtape.')
    }
  }
</script>

<template>
  <PageHeader title="Nouvelle mixtape">
    <template #actions>
      <Button size="icon" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <MixtapeForm teleport-to="page-header-actions" @cancel="handleCancel" @submit="handleSubmit" />
</template>
