<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const route = useRoute()
  const router = useRouter()
  const { resetPasswordAndLogin } = useAuthActions()

  // Récupérer le token et l'email depuis l'URL
  const token = route.query.token as string
  const emailFromUrl = route.query.email as string

  const formSchema = z
    .object({
      email: z.string().email('Email invalide').min(1, 'Email requis'),
      password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
      confirm: z.string().min(1, 'Confirmation requise'),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Le mot de passe et la confirmation doivent être identiques',
      path: ['confirm'],
    })

  // Valeurs par défaut du formulaire avec email pré-rempli
  const defaultValues = {
    email: emailFromUrl || '',
    password: '',
    confirm: '',
  }

  const handleSubmit = async ({ email, password }: { email: string; password: string; confirm: string }) => {
    if (!token) {
      toast.error('Token de réinitialisation manquant')
      return
    }

    // Reset password + auto-login pour les users Face B
    const result = await resetPasswordAndLogin(token, password, email)

    if (result.success) {
      if (result.user) {
        // Auto-login réussi
        toast.success('Mot de passe modifié et connexion automatique !')
        await router.push('/')
      } else {
        // Reset ok mais auto-login échoué
        toast.success('Mot de passe modifié avec succès ! Vous pouvez maintenant vous connecter.')
        await router.push('/login')
      }
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
      :default-values="defaultValues"
      :field-config="{
        email: {
          label: 'Email',
          inputProps: {
            type: 'email',
            placeholder: 'votre@email.com',
            autocomplete: 'email',
            disabled: !!emailFromUrl, // Lecture seule si l'email vient de l'URL
          },
        },
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
