<script lang="ts" setup>
  import { RefreshCwIcon } from 'lucide-vue-next'

  const { fetch: refresh } = useDjsStore()
  const { data, loading } = useDjsStoreRefs()

  const handleRefresh = async () => {
    await refresh()
  }

  const handleShowMixtapes = (name: string) => {
    return navigateTo({ path: '/mixtapes', query: { name } })
  }

  onBeforeMount(async () => {
    await refresh()
  })
</script>

<template>
  <PageHeader title="Les DJ's">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleRefresh">
        <RefreshCwIcon />
      </Button>
    </template>
  </PageHeader>
  <DjTable :data="data" :loading="loading" @row-show-mixtapes="handleShowMixtapes" />
</template>
