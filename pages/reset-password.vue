<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const config = useRuntimeConfig()

  const forgotPassword = async (email: string) => {
    // Passer l'origin de Face B pour que le lien de reset pointe vers cette app
    // On utilise window.location.origin côté client uniquement
    const origin = import.meta.client ? window.location.origin : 'http://localhost:3002'

    const response = await $fetch<{ message: string }>(`${config.public.apiUrl}/auth/forgot-password`, {
      method: 'POST',
      body: { email, origin },
      credentials: 'include',
    })
    return response
  }

  const formSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
  })

  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      await forgotPassword(email)
      toast.success('Si un compte correspond à cet email, un lien de réinitialisation y a été envoyé !')
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email de réinitialisation")
    }
  }
</script>

<template>
  <AuthBox title="Mot de passe oublié ?">
    <AutoForm class="space-y-6" :schema="formSchema" @submit="handleSubmit">
      <div class="flex flex-col items-center gap-5">
        <div class="flex gap-2">
          <Button type="submit">Demander un nouveau mot de passe</Button>
        </div>
        <div class="flex gap-2 text-xs">
          <NuxtLink to="/login">Annuler</NuxtLink>
        </div>
      </div>
    </AutoForm>
  </AuthBox>
</template>
