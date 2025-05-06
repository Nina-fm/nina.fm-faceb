<script lang="ts" setup>
  import { useAuthApi } from '#imports'
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const { login } = useAuthApi()

  const formSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
    password: z.string().min(1, 'Mot de passe requis'),
  })

  const handleError = (error: any) => {
    if (error?.response?.status === 401) {
      toast.error('Email ou mot de passe incorrect')
    } else {
      toast.error('Une erreur est survenue')
    }
  }

  const handleSubmit = async ({ email, password }: Record<string, any>) => {
    await login(email, password).catch(handleError)
  }
</script>

<template>
  <AuthBox title="Connexion">
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
      }"
      @submit="handleSubmit"
    >
      <div class="flex flex-col items-center gap-5">
        <div class="flex gap-2">
          <Button type="submit">Se connecter</Button>
        </div>
        <div class="flex gap-2 text-xs">
          <NuxtLink to="/reset-password">Mot de passe oublié ?</NuxtLink>
          <NuxtLink to="/register">Pas encore de compte ?</NuxtLink>
        </div>
      </div>
    </AutoForm>
  </AuthBox>
</template>
