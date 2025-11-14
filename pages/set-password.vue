<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const route = useRoute()
  const { resetPassword } = useAuthActions()

  // Récupérer le token depuis l'URL (query parameter 'token')
  const token = route.query.token as string

  const formSchema = z
    .object({
      password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
      confirm: z.string().min(1, 'Confirmation requise'),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Le mot de passe et la confirmation doivent être identiques',
      path: ['confirm'],
    })

  const handleSubmit = async ({ password }: { password: string; confirm: string }) => {
    if (!token) {
      toast.error('Token de réinitialisation manquant')
      return
    }

    const { success } = await resetPassword(token, password)
    if (success) {
      toast.success('Mot de passe réinitialisé avec succès !')
      await navigateTo('/login')
    } else {
      toast.error('Erreur lors de la réinitialisation du mot de passe')
    }
  }

  onMounted(() => {
    if (!token) {
      toast.error('Token de réinitialisation manquant')
      return navigateTo('/login')
    }
  })
</script>

<template>
  <AuthBox title="Nouveau mot de passe">
    <AutoForm
      class="space-y-6"
      :schema="formSchema"
      :field-config="{
        password: {
          label: 'Nouveau mot de passe',
          inputProps: {
            type: 'password',
            placeholder: 'Entrez votre nouveau mot de passe',
          },
        },
        confirm: {
          label: 'Confirmation',
          inputProps: {
            type: 'password',
            placeholder: 'Confirmez votre nouveau mot de passe',
          },
        },
      }"
      @submit="handleSubmit"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="flex gap-2">
          <Button type="submit">Réinitialiser le mot de passe</Button>
        </div>
        <div class="flex gap-2 text-xs">
          <NuxtLink to="/login">Retour à la connexion</NuxtLink>
        </div>
      </div>
    </AutoForm>
  </AuthBox>
</template>
