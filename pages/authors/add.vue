<script lang="ts" setup>
  import { XIcon } from 'lucide-vue-next'
  import type { AuthorParamsExt } from '~~/types/supatypes'

  const pageTitle = 'Nouveau DJ'

  definePageMeta({ middleware: ['auth'], breadcrumb: { label: pageTitle } })

  const { createAuthor } = useAuthorsStore()

  const handleCancel = async () => {
    await navigateTo('/authors')
  }

  const handleSubmit = async (form: AuthorParamsExt) => {
    const { error, data } = await createAuthor(form)

    if (!error && data?.id) await navigateTo(`/authors/${data.id}/edit`)
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
  <AuthorForm @cancel="handleCancel" @submit="handleSubmit" />
</template>

<style scoped></style>
