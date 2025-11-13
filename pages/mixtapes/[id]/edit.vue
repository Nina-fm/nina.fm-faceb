<script lang="ts" setup>
  import { LoaderCircleIcon, XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import type { MixtapeFormData } from '~/components/mixtapes/mixtape.schema'
  import type { Mixtape, UpdateMixtapeDto } from '~/types/api/mixtapes.types'
  import { Role } from '~/utils/roles'
  import { parseTracks, serializeTracks } from '~/utils/tracks'

  definePageMeta({ roles: [Role.ADMIN] })

  const route = useRoute()
  const id = route.params.id as string
  const { getMixtape, updateMixtape } = useMixtapeApi()

  // Fetch mixtape
  const { data: mixtapeData, isPending: isLoading, error } = getMixtape(id)
  const pending = computed(() => updateMixtape.isPending.value)

  // Transform API Mixtape → Form Data
  const mixtape = computed((): MixtapeFormData | undefined => {
    // L'API peut retourner soit { data: Mixtape } soit directement Mixtape
    const m = (mixtapeData.value?.data as unknown as Mixtape) || (mixtapeData.value as unknown as Mixtape)
    if (!m || typeof m !== 'object' || !('name' in m)) return undefined

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

  <div v-if="isLoading" class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent class="flex items-center justify-center p-20">
        <LoaderCircleIcon class="size-8 animate-spin" />
      </CardContent>
    </Card>
  </div>

  <div v-else-if="error" class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent class="p-20">
        <p class="text-destructive">Erreur lors du chargement de la mixtape</p>
        <pre class="mt-4 text-xs">{{ error }}</pre>
      </CardContent>
    </Card>
  </div>

  <MixtapeForm
    v-else-if="mixtape"
    :mixtape="mixtape"
    :pending="pending"
    teleport-to="page-header-actions"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />

  <div v-else class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent class="p-20">
        <p class="text-muted-foreground">Mixtape non trouvée</p>
      </CardContent>
    </Card>
  </div>
</template>
