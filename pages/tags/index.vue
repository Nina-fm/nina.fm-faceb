<script lang="ts" setup>
  import { LoaderCircleIcon, PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'

  definePageMeta({ roles: ['ADMIN'] })

  const route = useRoute()
  const { pending, fetchTags, deleteTag } = useTagApi()
  const { data, error, refresh } = await useAsyncData('tags', () => fetchTags())

  const tags = computed(() => data.value?.results || [])

  const variant = computed(() => {
    if (pending.value) return 'primaryMuted'
    return 'outline'
  })

  watch(error, (value) => {
    if (value) {
      toast.error('Une erreur est survenue lors de la récupération des tags.')
    }
  })

  const handleRefresh = async () => {
    await refresh()
  }

  const handleRowShow = (id: string) => {
    return navigateTo(`/tags/${id}`)
  }

  const handleRowEdit = (id: string) => {
    return navigateTo(`/tags/${id}/edit`)
  }

  const handleClearSearch = () => {
    return navigateTo('/tags')
  }

  const handleRowDelete = async (id: string) => {
    try {
      await deleteTag(id)
      await refresh()
      toast.success('Tag supprimé !')
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression du Tag.')
    }
  }
</script>

<template>
  <PageHeader title="Les tags">
    <template #actions>
      <Button size="fab" :variant="variant" @click="handleRefresh">
        <LoaderCircleIcon v-if="pending" class="animate-spin" />
        <RefreshCwIcon v-else />
      </Button>
      <Button as-child size="fab" variant="outline">
        <NuxtLink to="/tags/add">
          <PlusIcon />
        </NuxtLink>
      </Button>
    </template>
  </PageHeader>
  <TagTable
    :data="tags"
    :loading="pending"
    :search-value="route.query.name?.toString()"
    @clear-search="handleClearSearch"
    @row-show="handleRowShow"
    @row-edit="handleRowEdit"
    @row-delete="handleRowDelete"
  />
</template>
