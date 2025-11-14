<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false, middleware: ['invitation'] })

  const { register } = useAuthActions()
  const { invitationToken, tokenValidation } = useInvitationValidation()
  const emailPrefill = ref<string | undefined>(undefined)
  const invitationError = ref<string | null>(null)

  const formSchema = z
    .object({
      name: z.string().optional().describe('Nom'),
      email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
      password: z.string().min(1, 'Mot de passe requis'),
      confirm: z.string().min(1, 'Mot de passe requis'),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Les mot de passe ne correspondent pas.',
      path: ['confirm'],
    })

  const handleSubmit = async ({
    email,
    name,
    password,
  }: {
    email: string
    name?: string
    password: string
    confirm: string
  }) => {
    try {
      // invitationToken doit être string | undefined
      const token = invitationToken.value || undefined
      await register({ email, name, password, invitationToken: token })
      toast.success('Compte créé avec succès')
      
      // Reload page to trigger SSR + middleware redirect
      window.location.href = '/'
    } catch (error) {
      const err = error as { status?: number; data?: { message?: string } }
      if (err?.status === 409 || err?.status === 500) {
        const message = err?.data?.message || ''
        if (message.includes('duplicate') || message.includes('already exists')) {
          toast.error('Cet email est déjà utilisé')
        } else {
          toast.error("Une erreur est survenue lors de l'inscription")
        }
      } else if (err?.status === 401) {
        toast.error('Email ou mot de passe incorrect')
      } else {
        toast.error('Une erreur est survenue')
      }
    }
  }

  // Clé pour forcer la re-création du formulaire
  const formKey = computed(() => (emailPrefill.value ? 'with-email' : 'without-email'))

  // Valeurs par défaut du formulaire
  const defaultValues = computed(() => ({
    name: '',
    email: emailPrefill.value || '',
    password: '',
    confirm: '',
  }))

  onMounted(async () => {
    if (invitationToken.value) {
      try {
        const { mutateAsync } = tokenValidation.value || {}
        if (mutateAsync) {
          const data = await mutateAsync({ token: invitationToken.value })
          emailPrefill.value = data?.email || undefined
        }
      } catch (err) {
        invitationError.value =
          (err as { data?: { message?: string } })?.data?.message || "Lien d'invitation invalide ou expiré."
        if (invitationError.value) toast.error(invitationError.value)
      }
    }
  })
</script>

<template>
  <AuthBox title="Création de compte">
    <AutoForm
      :key="formKey"
      class="space-y-6"
      :schema="formSchema"
      :default-values="defaultValues"
      :field-config="{
        name: {
          label: 'Nom',
          inputProps: {
            type: 'text',
          },
        },
        email: {
          label: 'Email',
          inputProps: {
            type: 'email',
            autocomplete: 'email',
            readonly: !!emailPrefill,
          },
        },
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
          <Button :disabled="!!invitationError" type="submit">Créer le compte</Button>
        </div>
        <div class="flex gap-2 text-xs">
          <NuxtLink to="/login">Déjà un compte ?</NuxtLink>
        </div>
      </div>
    </AutoForm>
    <div v-if="invitationError" class="mb-6 rounded bg-red-100 p-4 text-red-700">
      {{ invitationError }}
    </div>
  </AuthBox>
</template>
