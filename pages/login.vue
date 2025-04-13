<script lang="ts" setup>
  import * as z from 'zod'

  definePageMeta({ layout: 'naked' })

  const { login } = useAuthStore()
  const { isLoggedIn } = useAuthStoreRefs()

  const formSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
    password: z.string().min(1, 'Mot de passe requis'),
  })

  const handleSubmit = async ({ email, password }: Record<string, any>) => {
    await login({ email, password })
  }

  watchEffect(async () => {
    if (!!isLoggedIn.value) {
      await navigateTo('/')
    }
  })
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
        </div>
      </div>
    </AutoForm>
  </AuthBox>
</template>
