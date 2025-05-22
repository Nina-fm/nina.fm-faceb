<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { FingerprintIcon, SaveIcon } from 'lucide-vue-next'
  import * as z from 'zod'

  const formSchema = z.object({
    name: z.string().min(1, 'Nom requis'),
    userId: z.string().optional(),
  })

  type Data = z.infer<typeof formSchema>

  const props = defineProps<{
    dj?: Data
    teleportTo?: string
    currentUserId?: string
    pending?: boolean
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: [data: Data]
  }>()

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      name: props?.dj?.name || '',
      userId: props?.dj?.userId || '',
    },
  })

  watch(
    () => props.dj,
    (dj) => {
      form.resetForm({
        values: {
          name: dj?.name || '',
          userId: dj?.userId || '',
        },
      })
    },
    { immediate: true },
  )

  const dirty = computed(() => form.meta.value.dirty)

  const handleCancel = () => {
    form.resetForm()
    emit('cancel')
  }

  const handleSubmit = form.handleSubmit((values) => {
    emit('submit', values)
  })

  const handleInsertUserId = () => {
    if (!props.currentUserId) return
    form.setFieldValue('userId', props.currentUserId)
  }
</script>

<template>
  <div class="py-10">
    <SafeForm :form="form" @submit="handleSubmit">
      <Card class="bg-foreground/3 @container/mixtapeform border-none">
        <CardContent>
          <div class="flex items-start gap-5">
            <div class="flex w-full flex-col gap-5">
              <TextField name="name" label="Nom" />
              <TextField name="userId" label="ID Utilisateur">
                <template #suffix>
                  <Button size="icon" variant="outline" @click.prevent="handleInsertUserId">
                    <FingerprintIcon />
                  </Button>
                </template>
              </TextField>
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

<style></style>
