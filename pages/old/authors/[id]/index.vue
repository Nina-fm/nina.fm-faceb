<script lang="ts" setup>
  import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-vue-next'

  const { params } = useRoute()
  const { getById } = useAuthorsStore()
  const { deleteAuthor } = useAuthorsStore()

  const id = params.id as string
  const { data } = await useAsyncData('author', () => getById(id))
  const openConfirm = ref(false)
  const author = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: author.value?.name ?? 'Détails du DJ',
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
    const { error } = await deleteAuthor(id)
    if (!error) {
      navigateTo('/authors')
    }
  }
</script>

<template>
  <PageHeader title="Le DJ en détails">
    <template #actions>
      <Button size="icon" variant="destructiveOutline" @click="handleDelete">
        <Trash2Icon />
      </Button>
      <Button size="icon" variant="outline">
        <NuxtLink :to="`/authors/${id}/edit`">
          <PencilIcon />
        </NuxtLink>
      </Button>
      <Button size="icon" variant="outline">
        <NuxtLink to="/authors/add">
          <PlusIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <AuthorDetails v-if="author" :author="author" />
</template>

<style scoped></style>
