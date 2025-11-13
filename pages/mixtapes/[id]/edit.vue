<script lang="ts" setup>
  import { XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import type { MixtapeFormData } from '~/components/mixtapes/mixtape.schema'
  import type { UpdateMixtapeDto } from '~/types/api/mixtapes.types'
  import { Role } from '~/utils/roles'
  import { parseTracks, serializeTracks } from '~/utils/tracks'

  definePageMeta({ roles: [Role.ADMIN] })

  const route = useRoute()
  const id = route.params.id as string
  const { getMixtape, updateMixtape } = useMixtapeApi()

  // Fetch mixtape
  const { data: mixtapeData } = getMixtape(id)
  const pending = computed(() => updateMixtape.isPending.value)

  // Transform API Mixtape → Form Data
  const mixtape = computed((): MixtapeFormData | undefined => {
    const m = mixtapeData.value?.data
    if (!m) return undefined

    return {
      name: m.name,
      year: String(m.year),
      djNames: m.djs?.map((dj) => dj.name) || [],
      tags: m.tags || [],
      tracks: m.tracksAsText ? parseTracks(m.tracksAsText) : [],
      tracksAsText: m.tracksAsText || '',
      comment: m.comment || '',
      cover: m.cover
        ? {
            filename: m.cover.originalName,
            bucket: m.cover.bucket,
            url: m.cover.uri,
          }
        : undefined,
    }
  })

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: mixtapeData.value?.data?.name ?? 'Modification de la mixtape',
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleCancel = () => {
    return navigateTo('/mixtapes')
  }

  const handleSubmit = async (values: MixtapeFormData) => {
    try {
      // Transform form data to API payload
      const payload: UpdateMixtapeDto = {
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

      await updateMixtape.mutateAsync({ mixtapeId: id, payload })
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
