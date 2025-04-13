<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked' })

  const { sendPasswordRestEmail } = useAuthStore()

  const formSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
  })

  const handleSubmit = async ({ email }: Record<string, any>) => {
    const { error } = await sendPasswordRestEmail(email)
    if (!error) {
      toast.success('Si un compte correspond à cet email, un lien de réinitialisation y a été envoyé !')
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
