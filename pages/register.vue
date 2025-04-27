<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const { register } = useAuth()

  const formSchema = z
    .object({
      email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
      password: z.string().min(1, 'Mot de passe requis'),
      confirm: z.string().min(1, 'Mot de passe requis'),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Les mot de passe ne correspondent pas.',
      path: ['confirm'],
    })

  const handleError = (error: any) => {
    if (error?.response?.status === 401) {
      toast.error('Email ou mot de passe incorrect')
    } else {
      toast.error('Une erreur est survenue')
    }
  }

  const handleSubmit = async ({ email, password }: Record<string, any>) => {
    await register(email, password).catch(handleError)
    await navigateTo('/')
  }
</script>

<template>
  <AuthBox title="Création de compte">
    <AutoForm
      class="space-y-6"
      :schema="formSchema"
      :field-config="{
        password: {
          label: 'Mot de passe',
          inputProps: {
            type: 'password',
          },
        },
        confirm: {
          label: 'Confirmation du mot de passe',
          inputProps: {
            type: 'password',
          },
        },
      }"
      @submit="handleSubmit"
    >
      <div class="flex flex-col items-center gap-5">
        <div class="flex gap-2">
          <Button type="submit">Créer le compte</Button>
        </div>
      </div>
    </AutoForm>
  </AuthBox>
</template>
