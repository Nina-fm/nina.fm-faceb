<script lang="ts" setup>
  import { XIcon } from 'lucide-vue-next'
  import type { MixtapeParamsExt } from '~/types/supatypes'

  definePageMeta({ middleware: ['auth'] })

  const { params } = useRoute()
  const { updateMixtape, getById } = useMixtapesStore()
  const id = params.id as string
  const { data } = await useAsyncData('mixtape', () => getById(id))
  const mixtape = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: mixtape.value?.name ?? 'Modification de la Mixtape',
      },
      undefined,
    ],
  })

  const handleCancel = async () => {
    await navigateTo('/mixtapes')
  }

  const handleSubmit = async (values: MixtapeParamsExt) => {
    const { error } = await updateMixtape(id, values)
  }
</script>

<template>
  <PageHeader title="Modifier la mixtape">
    <template #actions>
      <Button asChild size="icon" variant="outline">
        <NuxtLink :to="`/mixtapes`"><XIcon /></NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <MixtapeForm v-if="mixtape" :mixtape="mixtape" @cancel="handleCancel" @submit="handleSubmit" />
</template>

<style scoped></style>
