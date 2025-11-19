<script lang="ts" setup>
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import { Role } from '~/utils/roles'

  definePageMeta({ requiresRoles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR] })

  const { createTag } = useTagApi()
  const formRef = ref()

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: 'Nouveau tag',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/tags')
  }

  const handleSubmit = async (values: { name: string; color?: string }) => {
    try {
      await createTag.mutateAsync(values)
      // Réinitialiser le formulaire AVANT la navigation pour éviter le dialogue
      formRef.value?.resetForm()
      toast.success('Tag créé avec succès !')
      await navigateTo('/tags')
    } catch {
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
  <TagForm
    ref="formRef"
    teleport-to="page-header-actions"
    :pending="createTag.isPending.value"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
