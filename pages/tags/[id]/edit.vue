<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { pending, getTagById, updateTag } = useTagApi()
  const { data, refresh } = await useAsyncData('tag', () => getTagById(id))

  const tag = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: tag.value?.name ?? 'Modification du tag',
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/tags')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await updateTag(id, values as TagCreate)
      await refresh()
      toast.success('Tag modifié.')
    } catch (error) {
      console.error('Error editing tag:', error)
      toast.error('Erreur lors de la modification du tag.')
    }
  }
</script>

<template>
  <PageHeader title="Modifier le tag">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <TagForm
    v-if="tag"
    :tag="tag"
    :pending="pending"
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
