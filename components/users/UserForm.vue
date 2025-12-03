<script lang="ts" setup>
  import { toTypedSchema } from '@vee-validate/zod'
  import { SaveIcon } from 'lucide-vue-next'
  import * as z from 'zod'
  import type { User } from '~/types/api/users.types'

  const formSchema = z.object({
    nickname: z.string().min(2, 'Le nom doit faire au moins 2 caractères').max(255),
    firstName: z.string().max(255).nullable().optional(),
    lastName: z.string().max(255).nullable().optional(),
    email: z.string().email('Email invalide').min(1, 'Email requis'),
    description: z.string().max(1000).nullable().optional(),
    avatar: z
      .object({
        id: z.string().optional(),
        filename: z.string().optional(),
        file: z.instanceof(File).optional(),
        alt: z.string().nullable().optional(),
        bucket: z.string().nullable().optional(),
        url: z.string().optional(),
      })
      .nullable()
      .optional(),
    role: z.enum([Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR, Role.VIEWER]).optional(),
  })

  type Data = z.infer<typeof formSchema>

  const props = defineProps<{
    user: User
    teleportTo?: string
    canEditRoles: boolean
    pending?: boolean
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: [data: Data]
  }>()

  const { getImageUrl } = useImageApi()

  const roleOptions = [
    { label: 'Administrateur', value: Role.ADMIN },
    { label: 'Gestionnaire', value: Role.MANAGER },
    { label: 'Contributeur', value: Role.CONTRIBUTOR },
    { label: 'Observateur', value: Role.VIEWER },
  ]

  // Filtrer le rôle PUBLIC qui n'est pas applicable aux utilisateurs
  const getUserRole = (role: string) => {
    if (role === 'PUBLIC') return Role.VIEWER
    return role as (typeof roleOptions)[number]['value']
  }

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      nickname: props.user.profile?.nickname || '',
      firstName: props.user.profile?.firstName || '',
      lastName: props.user.profile?.lastName || '',
      email: props.user.email,
      description: props.user.profile?.description || '',
      avatar: props.user.profile?.avatar
        ? {
            id: props.user.profile.avatar.id,
            bucket: props.user.profile.avatar.bucket,
            filename: props.user.profile.avatar.originalName,
            url: getImageUrl(props.user.profile.avatar) || undefined,
            alt: props.user.profile.avatar.originalName,
          }
        : null,
      role: getUserRole(props.user.role),
    },
  })

  watch(
    () => props.user,
    (user) => {
      form.resetForm({
        values: {
          nickname: user.profile?.nickname || '',
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          email: user.email,
          description: user.profile?.description || '',
          avatar: user.profile?.avatar
            ? {
                id: user.profile.avatar.id,
                bucket: user.profile.avatar.bucket,
                filename: user.profile.avatar.originalName,
                url: getImageUrl(user.profile.avatar) || undefined,
                alt: user.profile.avatar.originalName,
              }
            : null,
          role: getUserRole(user.role),
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

  // Exposer resetForm pour pouvoir l'appeler depuis le parent
  defineExpose({
    resetForm: () => form.resetForm(),
  })
</script>

<template>
  <div class="py-10">
    <SafeForm :form="form" @submit="handleSubmit">
      <Card class="bg-foreground/3 @container/userform border-none">
        <CardContent>
          <div class="flex items-start gap-5">
            <ImageField name="avatar" bucket="avatars" label="Avatar" class="w-1/4" />
            <div class="flex w-3/4 flex-col gap-5">
              <TextField name="nickname" label="Nom d'affichage" />
              <div class="flex gap-4">
                <TextField name="firstName" label="Prénom" class="flex-1" />
                <TextField name="lastName" label="Nom" class="flex-1" />
              </div>
              <TextField name="email" label="Email" readonly />
              <TextareaField name="description" label="Description" />
              <SelectField v-if="canEditRoles" name="role" label="Rôle" :options="roleOptions" />
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
