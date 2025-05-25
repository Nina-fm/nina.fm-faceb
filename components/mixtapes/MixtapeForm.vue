<script lang="ts" setup>
  import type { Dj } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { SaveIcon } from 'lucide-vue-next'
  import * as z from 'zod'
  import SaveButton from '~/components/common/SaveButton.vue'

  const currentYear = new Date().getFullYear().toString()
  const years = generateYearsSince(2007)
  const yearsOptions = computed(() => years.map((year) => ({ value: year, label: year })))

  const { fetchDjs } = useDjApi()
  const response = await fetchDjs()
  const djs = response?.data.value.results as Dj[]
  console.log('djs', djs)
  const djsAsOptions = computed(() => djs?.map((dj) => ({ value: dj.id, label: dj.name })) ?? [])
  console.log('djsAsOptions', djsAsOptions.value)

  const formSchema = z.object({
    name: z.string().min(1, 'Nom requis'),
    year: z.enum(years as [string, ...string[]]),
    cover: z
      .object({
        filename: z.string().optional(),
        file: z.instanceof(File).optional(),
        alt: z.string().optional(),
        bucket: z.string().nullable().optional(),
        url: z.string().optional(),
      })
      .optional(),
    djsAsText: z.string().min(1, 'Djs requis'),
    djs: z.array(z.string()).optional(),
    tracksAsText: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
  })

  type Data = z.infer<typeof formSchema>

  const props = defineProps<{
    mixtape?: Data
    teleportTo?: string
    pending?: boolean
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: [data: Data]
  }>()

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      name: props?.mixtape?.name || '',
      year: props?.mixtape?.year || currentYear,
      cover: props?.mixtape?.cover
        ? {
            bucket: props.mixtape?.cover?.bucket,
            filename: props.mixtape?.cover?.filename,
            url: props.mixtape?.cover?.url,
            alt: props.mixtape?.cover?.alt,
          }
        : undefined,
      djsAsText: props?.mixtape?.djsAsText || '',
      tracksAsText: props?.mixtape?.tracksAsText || '',
      comment: props?.mixtape?.comment || '',
    },
  })

  watch(
    () => props.mixtape,
    (mixtape) => {
      form.resetForm({
        values: {
          name: mixtape?.name || '',
          year: mixtape?.year || currentYear,
          cover: mixtape?.cover
            ? {
                bucket: mixtape?.cover?.bucket,
                filename: mixtape?.cover?.filename,
                url: mixtape?.cover?.url,
                alt: mixtape?.cover?.alt,
              }
            : undefined,
          djsAsText: mixtape?.djsAsText || '',
          tracksAsText: mixtape?.tracksAsText || '',
          comment: mixtape?.comment || '',
        },
      })
    },
  )

  const dirty = computed(() => form.meta.value.dirty)

  const handleCancel = () => {
    form.resetForm()
    emit('cancel')
  }

  const handleSubmit = form.handleSubmit((values: Data) => {
    emit('submit', values)
  })

  const handleCreate = (value: string) => {
    console.log('handleCreate', value)
  }

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
                <!-- <BadgesField name="tags" label="Tags" itemLabelKey="name" /> -->
              </div>
              <div class="aspect-square w-full @xl/mixtapeform:w-1/2 @2xl/mixtapeform:w-1/3 @4xl/mixtapeform:w-1/4">
                <ImageField name="cover" bucket="covers" label="Cover" description="Taille recommandée : 1600x1600px" />
              </div>
            </div>
            <TextField name="tracksAsText" label="Pistes" :description="hint" multiline />
            <!-- <ObjectsField
              name="tracks"
              label="Pistes"
              placeholder="Aucune piste"
              :objectFields="[
                { type: 'text', label: 'Artiste', name: 'artist' },
                { type: 'text', label: 'Titre', name: 'title' },
                { type: 'text', label: 'Début', name: 'start_at' },
              ]"
            /> -->
            <TextField name="comment" label="Commentaire" multiline />
          </div>
        </CardContent>
        <ClientOnly v-if="props.teleportTo">
          <Teleport :to="`#${props.teleportTo}`">
            <SaveButton :pending="pending" :dirty="dirty" :success="form.meta.value.valid" @submit="handleSubmit" />
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
