<script lang="ts" setup>
  import { Loader2Icon, XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import { Role } from '~/utils/roles'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { getTag, updateTag } = useTagApi()
  const { data, isPending, error } = getTag(id)
  const tag = computed(() => data.value?.data)

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

  const handleSubmit = async (values: { name: string; color?: string }) => {
    try {
      await updateTag.mutateAsync({ tagId: id, payload: values })
      toast.success('Tag modifié avec succès !')
    } catch {
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

  <div v-if="isPending" class="flex items-center justify-center py-8">
    <Loader2Icon class="text-muted-foreground h-8 w-8 animate-spin" />
  </div>
  <div v-else-if="error" class="text-destructive flex flex-col items-center justify-center py-8">
    <p>Erreur lors du chargement du tag</p>
  </div>
  <TagForm
    v-else-if="tag"
    :tag="tag"
    :pending="updateTag.isPending.value"
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
