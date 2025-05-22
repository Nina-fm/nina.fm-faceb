<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { user: currentUser } = useAuthApi()
  const { getDjById, updateDj, pending } = useDjApi()
  const { data, refresh } = await useAsyncData('dj', () => getDjById(id))
  const dj = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: dj.value?.name ?? 'Modification du dj',
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/djs')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await updateDj(id, values as DjEdit)
      await refresh()
      toast.success('Dj modifié.')
    } catch (error) {
      console.error('Error editing dj:', error)
      toast.error('Erreur lors de la modification du dj.')
    }
  }
</script>

<template>
  <PageHeader title="Modifier le dj">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <DjForm
    v-if="dj"
    :dj="dj"
    teleport-to="page-header-actions"
    :currentUserId="currentUser?.id"
    :pending="pending"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
