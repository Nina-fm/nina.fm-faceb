<script lang="ts" setup>
  import { XIcon } from 'lucide-vue-next'
  import type { MixtapeParamsExt } from '~~/types/supatypes'

  const pageTitle = 'Nouvelle mixtape'

  definePageMeta({ breadcrumb: { label: pageTitle } })

  const { createMixtape } = useMixtapesStore()

  const handleCancel = async () => {
    await navigateTo('/mixtapes')
  }

  const handleSubmit = async (form: MixtapeParamsExt) => {
    const { error, data } = await createMixtape(form)

    if (!error && data?.id) await navigateTo(`/mixtapes/${data.id}/edit`)
  }
</script>

<template>
  <PageHeader :title="pageTitle">
    <template #actions>
      <Button size="icon" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <MixtapeForm @cancel="handleCancel" @submit="handleSubmit" />
</template>

<style scoped></style>
