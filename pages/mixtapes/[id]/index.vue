<script lang="ts" setup>
  import { PencilIcon, Trash2Icon, XIcon } from 'lucide-vue-next'

  const { params } = useRoute()
  const { getById } = useMixtapesStore()
  const { deleteMixtape } = useMixtapesStore()

  const id = params.id as string
  const { data } = await useAsyncData('mixtape', () => getById(id))
  const openConfirm = ref(false)
  const mixtape = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: mixtape.value?.name ?? 'Détails de la mixtape',
      },
    ],
  })

  const handleDelete = () => {
    openConfirm.value = true
  }

  const handleCloseConfirm = () => {
    openConfirm.value = false
  }

  const handleConfirmDelete = async () => {
    const { error } = await deleteMixtape(id)
    if (!error) {
      await navigateTo('/mixtapes')
    }
  }
</script>

<template>
  <PageHeader title="La mixtape en détails">
    <template #actions>
      <Button size="icon" variant="destructiveOutline" @click="handleDelete"><Trash2Icon /></Button>
      <Button asChild size="icon" variant="outline">
        <NuxtLink :to="`/mixtapes/${id}/edit`"><PencilIcon /></NuxtLink>
      </Button>
      <Button asChild size="icon" variant="outline">
        <NuxtLink :to="`/mixtapes`"><XIcon /></NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <MixtapeDetails v-if="mixtape" :mixtape="mixtape" />
</template>
