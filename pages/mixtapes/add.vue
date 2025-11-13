<script lang="ts" setup>
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import type { MixtapeFormData } from '~/components/mixtapes/mixtape.schema'
  import type { CreateMixtapeDto } from '~/types/api/mixtapes.types'
  import { Role } from '~/utils/roles'
  import { serializeTracks } from '~/utils/tracks'

  definePageMeta({ roles: [Role.ADMIN] })

  const { createMixtape } = useMixtapeApi()
  const isSubmitting = ref(false)
  const pending = computed(() => createMixtape.isPending.value || isSubmitting.value)

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

  const handleSubmit = async (values: MixtapeFormData) => {
    if (isSubmitting.value) return // Prevent double submission

    // Transform form data to API payload
    const payload: CreateMixtapeDto = {
      name: values.name,
      year: parseInt(values.year, 10),
      djNames: values.djNames,
      tagNames: values.tags?.map((tag) => tag.name) || [],
      tracksAsText:
        values.tracks && values.tracks.length > 0
          ? serializeTracks(
              values.tracks.map((t) => ({
                ...t,
                start_at: t.start_at ?? null,
              })),
            )
          : undefined,
      comment: values.comment || undefined,
      coverId: undefined, // TODO: Handle cover upload
      defaultTagColor: '#6B7280',
    }

    isSubmitting.value = true
    const toastId = toast.loading('Création en cours...')

    try {
      const result = await createMixtape.mutateAsync(payload)

      // L'API retourne directement la mixtape, pas { data: mixtape }
      if (result?.id) {
        toast.success('Mixtape créée avec succès !', { id: toastId })
        // Wait a bit for the toast to show before navigating
        await new Promise((resolve) => setTimeout(resolve, 800))
        await navigateTo(`/mixtapes/${result.id}/edit`)
      } else {
        toast.error('Erreur: ID manquant', { id: toastId })
        console.error('No ID in result:', result)
      }
    } catch (error) {
      toast.error('Erreur lors de la création', { id: toastId })
      console.error('Error creating mixtape:', error)
    } finally {
      // Keep isSubmitting true until navigation happens
      // isSubmitting.value = false
    }
  }
</script>

<template>
  <PageHeader title="Nouvelle mixtape">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <MixtapeForm teleport-to="page-header-actions" :pending="pending" @cancel="handleCancel" @submit="handleSubmit" />
</template>
