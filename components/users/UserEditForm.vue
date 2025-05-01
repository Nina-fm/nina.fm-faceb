<script lang="ts" setup>
  import { Role } from '@prisma/client'
  import { toTypedSchema } from '@vee-validate/zod'
  import { SaveIcon } from 'lucide-vue-next'
  import * as z from 'zod'
  import type { User } from '~/types/db'

  const formSchema = z.object({
    name: z.string().min(1, 'Nom requis').optional(),
    email: z.string().email('Email invalide').min(1, 'Email requis'),
    avatar: z.object({ filename: z.string().optional(), alt: z.string().optional() }).optional(),
    roles: z.array(z.enum([Role.ADMIN, Role.USER])).optional(),
  })

  type EditData = z.infer<typeof formSchema>

  const props = defineProps<{
    user: User
    teleportTo?: string
  }>()

  const emit = defineEmits<{
    cancel: []
    submit: [data: EditData]
  }>()

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      name: props.user.name || '',
      email: props.user.email,
      avatar: {
        filename: props.user.avatar?.filename,
        alt: props.user.avatar?.alt,
      },
      roles: props.user.roles,
    },
  })

  const dirty = computed(() => form.meta.value.dirty)

  const handleCancel = () => {
    form.resetForm()
    emit('cancel')
  }

  const handleSubmit = form.handleSubmit((values) => {
    emit('submit', values)
  })
</script>

<template>
  <div class="py-10">
    <form @submit="handleSubmit">
      <Card class="bg-foreground/3 @container/mixtapeform border-none">
        <CardContent>
          <div class="flex items-start gap-5">
            <ImageField name="avatar" label="Avatar" class="w-1/4" />
            <div class="flex w-3/4 flex-col gap-5">
              <TextField name="name" label="Nom" />
              <TextField name="email" label="Email" readonly />
              <BadgedOptionsField name="roles" label="Rôles" :options="[Role.ADMIN, Role.USER]" />
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
