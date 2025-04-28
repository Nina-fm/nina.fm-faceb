<script lang="ts" setup>
  import { SaveIcon, XIcon } from 'lucide-vue-next'
  import type { MixtapeParamsExt } from '~/types/supatypes'

  const { params } = useRoute()
  const id = params.id as string
  const { updateMixtape, getById } = useMixtapesStore()
  const { data } = await useAsyncData('mixtape', () => getById(id))

  const isFormDirty = ref(false)
  const mixtape = computed(() => data.value)

  useBreadcrumbItems({
    overrides: [
      undefined,
      undefined,
      {
        label: mixtape.value?.name ?? 'Modification de la Mixtape',
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
    await navigateTo('/mixtapes')
  }

  const handleSubmit = async (values: MixtapeParamsExt) => {
    const { error } = await updateMixtape(id, values)
  }
</script>

<template>
  <PageHeader title="Modifier la mixtape">
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
  <MixtapeForm
    v-if="mixtape"
    :mixtape="mixtape"
    @form:dirty="handleFormDirty"
    @cancel="handleCancel"
    @submit="handleSubmit"
  />
</template>

<style scoped></style>
