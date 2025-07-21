<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { SaveIcon } from 'lucide-vue-next'
  import { computed } from 'vue'
  import SaveButton from '~/components/common/SaveButton.vue'
  import { mixtapeFormSchema, mixtapeFormSetValues } from '~/components/mixtapes/mixtape.schema'
  import type { Tag } from '~/types/db'
  import type { MixtapeFormData } from './mixtape.schema'

  const props = defineProps<{
    mixtape?: MixtapeFormData
    teleportTo?: string
    pending?: boolean
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: [data: MixtapeFormData]
  }>()

  const { fetchTags } = useTagApi()
  const { data } = await useAsyncData('tags', () => fetchTags())

  const form = useForm({
    validationSchema: toTypedSchema(mixtapeFormSchema),
    initialValues: mixtapeFormSetValues(props?.mixtape),
  })

  const yearsOptions = generateYearsSince(2007).map((year) => ({ value: year, label: year }))

  const dirty = computed(() => form.meta.value.dirty)
  const valid = computed(() => form.meta.value.valid)
  const tags = computed(() => data.value.results || [])
  const tagsOptions = computed(() =>
    tags.value.map((tag: Tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    })),
  )

  watch(
    () => props.mixtape,
    (mixtape) => {
      form.resetForm({
        values: mixtapeFormSetValues(mixtape),
      })
    },
  )

  watch(
    () => form,
    (values) => {
      console.log('Form changed')
      console.log('values', values.values.tracks)
      console.log('meta', values.meta)
    },
    { deep: true },
  )

  const handleCancel = () => {
    form.resetForm()
    emit('cancel')
  }

  const handleSubmit = form.handleSubmit((values: MixtapeFormData) => {
    emit('submit', values)
  })

  const hint = 'Attention à bien respecter le format AirTime !'
</script>

<template>
  <div class="py-10">
    <SafeForm :form="form" @submit="handleSubmit">
      <Card class="bg-foreground/3 @container/mixtapeform border-none">
        <CardContent>
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-10 @xl/mixtapeform:flex-row">
              <div
                class="flex w-full flex-col gap-5 @xl/mixtapeform:w-1/2 @2xl/mixtapeform:w-2/3 @4xl/mixtapeform:w-3/4"
              >
                <TextField name="name" label="Nom" :description="hint" />
                <div class="flex w-full items-start gap-5">
                  <TextField name="djsAsText" label="Djs" :description="hint" class="w-full" />
                  <SelectField name="year" label="Année" :options="yearsOptions" class="w-1/4 min-w-24" />
                </div>
                <TagsField name="tags" label="Tags" option-label-key="name" :options="tagsOptions" tag-as="TagBadge" />
              </div>
              <div class="aspect-square w-full @xl/mixtapeform:w-1/2 @2xl/mixtapeform:w-1/3 @4xl/mixtapeform:w-1/4">
                <ImageField name="cover" bucket="covers" label="Cover" description="Taille recommandée : 1600x1600px" />
              </div>
            </div>
            <!-- <TracksField name="tracks" label="Pistes" /> -->
            <ObjectsField
              name="tracks"
              label="Pistes"
              :object-fields="[
                { name: 'artist', type: 'text', label: 'Artiste' },
                { name: 'title', type: 'text', label: 'Titre' },
                { name: 'start_at', type: 'time', label: 'Début', class: 'w-32' },
              ]"
            />
            <TextField name="comment" label="Commentaire" multiline />
          </div>
        </CardContent>
        <ClientOnly v-if="props.teleportTo">
          <Teleport :to="`#${props.teleportTo}`">
            <SaveButton :pending="pending" :dirty="dirty" :success="valid" @submit="handleSubmit" />
          </Teleport>
        </ClientOnly>
        <CardFooter v-else class="flex justify-end gap-2">
          <Button type="button" variant="outline" @click="handleCancel">Annuler</Button>
          <Button type="submit" :variant="dirty ? 'default' : 'primaryOutline'" :disabled="!dirty">
            <SaveIcon />
            Enregistrer
          </Button>
        </CardFooter>
      </Card>
    </SafeForm>
  </div>
</template>
