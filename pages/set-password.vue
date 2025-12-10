<script lang="ts" setup>
  import EmailPassword from 'supertokens-web-js/recipe/emailpassword'
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const route = useRoute()
  const router = useRouter()

  // Récupérer le token depuis l'URL (envoyé par SuperTokens)
  const token = route.query.token as string

  const formSchema = z
    .object({
      password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
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

    try {
      // Utiliser SuperTokens pour reset le mot de passe
      const response = await EmailPassword.submitNewPassword({
        formFields: [
          {
            id: 'password',
            value: password,
          },
        ],
        token,
      })

      if (response.status === 'OK') {
        toast.success('Mot de passe modifié avec succès !')

        // Essayer de récupérer l'email depuis les userContext de SuperTokens
        // ou rediriger vers login pour connexion manuelle
        await router.push('/login?message=password-reset-success')
      } else {
        // Token invalide ou expiré
        toast.error('Le lien de réinitialisation est invalide ou a expiré')
        await router.push('/reset-password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Erreur lors de la réinitialisation du mot de passe')
    }
  }

  onMounted(() => {
    if (!token) {
      toast.error('Token de réinitialisation manquant')
      return navigateTo('/reset-password')
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
            placeholder: 'Minimum 8 caractères',
            autocomplete: 'new-password',
          },
        },
        confirm: {
          label: 'Confirmation',
          inputProps: {
            type: 'password',
            placeholder: 'Confirmez votre nouveau mot de passe',
            autocomplete: 'new-password',
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
