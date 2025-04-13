<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked' })

  const route = useRoute()
  const { update } = useAuthStore()

  const formSchema = z
    .object({
      password: z.string().min(1, 'Mot de passe requis'),
      confirm: z.string().min(1, 'Mot de passe requis'),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Le mot de passe et la confirmation doivent être identiques',
      path: ['confirm'],
    })

  const handleSubmit = async ({ password, confirm }: Record<string, any>) => {
    if (password !== confirm) {
      toast.error('Le mot de passe et la confirmation doivent être identiques')
      return
    }
    await update({ password })
    await navigateTo('/')
  }

  onMounted(() => {
    if (!route.hash) {
      return navigateTo('/login')
    }
  })
</script>

<template>
  <AuthBox title="Mot de passe">
    <AutoForm
      class="space-y-6"
      :schema="formSchema"
      :field-config="{
        password: {
          label: 'Nouveau Mmt de passe',
          inputProps: {
            type: 'password',
          },
        },
        confirm: {
          label: 'Confirmation',
          inputProps: {
            type: 'password',
          },
        },
      }"
      @submit="handleSubmit"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="flex gap-2">
          <Button type="submit">Sauvegarder</Button>
        </div>
      </div>
    </AutoForm>
  </AuthBox>
</template>
