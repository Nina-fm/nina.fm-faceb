<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { SaveIcon } from 'lucide-vue-next'
  import * as z from 'zod'
  import SaveButton from '~/components/common/SaveButton.vue'

  const formSchema = z.object({
    name: z.string().min(1, 'Nom requis'),
    color: z.string().optional(),
  })

  type Data = z.infer<typeof formSchema>

  const props = defineProps<{
    tag?: Data
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
      name: props?.tag?.name || '',
      color: props?.tag?.color || '#FFFFFF',
    },
  })

  watch(
    () => props.tag,
    (tag) => {
      form.resetForm({
        values: {
          name: tag?.name || '',
          color: tag?.color || '#FFFFFF',
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

  // Exposer la méthode resetForm pour usage externe
  defineExpose({
    resetForm: () => form.resetForm(),
  })
</script>

<template>
  <div class="py-10">
    <SafeForm :form="form" @submit="handleSubmit">
      <Card class="bg-foreground/3 @container/tagform border-none">
        <CardContent>
          <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-10 @xl/tagform:flex-row">
              <div class="flex w-full flex-col gap-5">
                <TextField name="name" label="Nom" />
                <ColorField name="color" label="Couleur" />
              </div>
            </div>
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
