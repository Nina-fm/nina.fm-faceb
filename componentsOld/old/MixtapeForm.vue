<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { useForm } from 'vee-validate'
  import * as z from 'zod'
  import SelectField from '~/components/fields/SelectField.vue'
  import TextField from '~/components/fields/TextField.vue'
  import type { MixtapeExt, MixtapeParamsExt } from '~/types/supatypes'

  const props = defineProps<{
    mixtape?: MixtapeExt
  }>()

  const emit = defineEmits<{
    (e: 'form:dirty', value: boolean): void
    (e: 'cancel'): void
    (e: 'submit', value: MixtapeParamsExt): void
  }>()

  const { mixtape } = toRefs(props)
  const { fetchTags } = useTagsStore()

  const years = generateYearsSince(2007)
  const yearsOptions = computed(() => years.map((year) => ({ value: year, label: year })))

  const formSchema = toTypedSchema(
    z.object({
      name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
      year: z.enum(years as [string, ...string[]]),
      authors: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
      tags: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
      tracks: z.array(z.object({ artist: z.string(), title: z.string(), start_at: z.string().optional() })).optional(),
      cover: z.object({ filename: z.string().optional(), url: z.string().optional() }).optional(),
      comment: z.string().optional(),
    }),
  )

  const form = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: mixtape.value?.name || '',
      year: mixtape.value?.year || '',
      authors: mixtape.value?.authors || [],
      tags: mixtape.value?.tags || [],
      tracks: mixtape.value?.tracks || [],
      cover: {
        filename: mixtape.value?.cover || '',
        url: mixtape.value?.cover_url || '',
      },
      comment: mixtape.value?.comment || '',
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    emit('submit', values as MixtapeParamsExt)
  })

  watch(
    () => form.meta.value.dirty,
    (value) => {
      emit('form:dirty', value)
    },
  )

  onMounted(() => {
    fetchTags()
  })

  const hint = 'Attention à bien respecter le format AirTime !'
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 @container/mixtapeform border-none">
      <CardContent>
        <form @submit="() => handleSubmit()">
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-10 @xl/mixtapeform:flex-row">
              <div
                class="flex w-full flex-col gap-5 @xl/mixtapeform:w-1/2 @2xl/mixtapeform:w-2/3 @4xl/mixtapeform:w-3/4"
              >
                <TextField name="name" label="Nom" :description="hint" />
                <div class="flex w-full gap-5">
                  <SelectField name="year" label="Année" :options="yearsOptions" />
                  <BadgesField name="authors" label="DJ's" itemLabelKey="name" class="grow" />
                </div>
                <BadgesField name="tags" label="Tags" itemLabelKey="name" />
              </div>
              <div class="aspect-square w-full @xl/mixtapeform:w-1/2 @2xl/mixtapeform:w-1/3 @4xl/mixtapeform:w-1/4">
                <ImageField name="cover" label="Cover" description="Taille recommandée : 1600x1600px" />
              </div>
            </div>
            <ObjectsField
              name="tracks"
              label="Pistes"
              placeholder="Aucune piste"
              :objectFields="[
                { type: 'text', label: 'Artiste', name: 'artist' },
                { type: 'text', label: 'Titre', name: 'title' },
                { type: 'text', label: 'Début', name: 'start_at' },
              ]"
            />
            <TextField name="comment" label="Commentaire" multiline />
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
