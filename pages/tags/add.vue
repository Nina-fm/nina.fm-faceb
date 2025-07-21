<script lang="ts" setup>
  // Types globaux depuis api.d.ts - Role est disponible
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { createTag, pending } = useTagApi()

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
      const tag = await createTag(values as TagCreate)
      if (tag) {
        toast.success('Tag créé.')
        await navigateTo(`/tags/${tag.id}/edit`)
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error('Erreur lors de la création du tag.')
    }
  }
</script>

<template>
  <PageHeader title="Nouveau tag">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <TagForm teleport-to="page-header-actions" :pending="pending" @cancel="handleCancel" @submit="handleSubmit" />
</template>
