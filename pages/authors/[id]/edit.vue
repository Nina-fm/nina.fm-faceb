<script lang="ts" setup>
  import { SaveIcon, XIcon } from 'lucide-vue-next'
  import type { AuthorParamsExt } from '~/types/supatypes'

  definePageMeta({ middleware: ['auth'] })

  const { params } = useRoute()
  const id = params.id as string
  const { updateAuthor, getById } = useAuthorsStore()
  const { data } = await useAsyncData('author', () => getById(id))

  const isFormDirty = ref(false)
  const author = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: author.value?.name ?? 'Modification du DJ',
      },
      {
        label: 'Modifier',
      },
    ],
  })

  const handleFormDirty = (value: boolean) => {
    isFormDirty.value = value
  }

  const handleSave = async () => {}

  const handleCancel = async () => {
    await navigateTo('/authors')
  }

  const handleSubmit = async (values: AuthorParamsExt) => {
    const { error } = await updateAuthor(id, values)
  }
</script>

<template>
  <PageHeader title="Modifier le DJ">
    <template #actions>
      <Transition name="fade">
        <Button v-if="isFormDirty" size="icon" @click="handleSave">
          <SaveIcon />
        </Button>
      </Transition>
      <Button size="icon" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>
  <AuthorForm
    v-if="author"
    :author="author"
    @form:dirty="handleFormDirty"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>
