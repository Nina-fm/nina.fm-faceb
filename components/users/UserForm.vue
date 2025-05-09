<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { SaveIcon } from 'lucide-vue-next'
  import * as z from 'zod'

  const formSchema = z.object({
    name: z.string().nullable().optional(),
    email: z.string().email('Email invalide').min(1, 'Email requis'),
    avatar: z
      .object({
        filename: z.string().optional(),
        file: z.instanceof(File).optional(),
        alt: z.string().nullable().optional(),
        bucket: z.string().nullable().optional(),
        url: z.string().optional(),
      })
      .optional(),
    roles: z.array(z.enum([Role.ADMIN, Role.USER])).optional(),
  })

  type Data = z.infer<typeof formSchema>

  const props = defineProps<{
    user: Data
    teleportTo?: string
    canEditRoles: boolean
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: [data: Data]
  }>()

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      name: props.user.name || '',
      email: props.user.email,
      avatar: props.user.avatar
        ? {
            bucket: props.user.avatar.bucket,
            filename: props.user.avatar.filename,
            url: props.user.avatar.url,
            alt: props.user.avatar.alt,
          }
        : undefined,
      roles: props.user.roles,
    },
  })

  watch(
    () => props.user,
    (user) => {
      form.resetForm({
        values: {
          name: user.name || '',
          email: user.email,
          avatar: user.avatar
            ? {
                bucket: user.avatar.bucket,
                filename: user.avatar.filename,
                url: user.avatar.url,
                alt: user.avatar.alt,
              }
            : undefined,
          roles: user.roles,
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
</script>

<template>
  <div class="py-10">
    <form @submit="handleSubmit">
      <Card class="bg-foreground/3 @container/mixtapeform border-none">
        <CardContent>
          <div class="flex items-start gap-5">
            <ImageField name="avatar" bucket="avatars" label="Avatar" class="w-1/4" />
            <div class="flex w-3/4 flex-col gap-5">
              <TextField name="name" label="Nom" />
              <TextField name="email" label="Email" readonly />
              <BadgedOptionsField v-if="canEditRoles" name="roles" label="Rôles" :options="[Role.ADMIN, Role.USER]" />
            </div>
          </div>
        </CardContent>
        <ClientOnly v-if="props.teleportTo">
          <Teleport :to="`#${props.teleportTo}`">
            <Button
              size="icon"
              :variant="dirty ? 'default' : 'primaryOutline'"
              :disabled="!dirty"
              @click="handleSubmit"
            >
              <SaveIcon />
            </Button>
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
    </form>
  </div>
</template>

<style></style>
