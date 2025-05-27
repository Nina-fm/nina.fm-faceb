<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: [Role.ADMIN] })

  const { params } = useRoute()
  const id = params.id as string
  const { pending, getMixtapeById, updateMixtape } = useMixtapeApi()
  const { data, refresh } = await useAsyncData('mixtape', () => getMixtapeById(id))

  const mixtape = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: mixtape.value?.name ?? 'Modification de la mixtape',
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleCancel = () => {
    return navigateTo('/mixtapes')
  }

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await updateMixtape(id, values as MixtapeCreate)
      await refresh()
      toast.success('Mixtape modifiée.')
    } catch (error) {
      console.error('Error editing mixtape:', error)
      toast.error('Erreur lors de la modification de la mixtape.')
    }
  }
</script>

<template>
  <PageHeader title="Modifier la mixtape">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <MixtapeForm
    v-if="mixtape"
    :mixtape="mixtape"
    :pending="pending"
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
