<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false, middleware: ['invitation'] })

  const { register, checkEmailExists, linkAccountWithInvitation } = useAuthActions()
  const { invitationToken, tokenValidation } = useInvitationValidation()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const emailPrefill = ref<string | undefined>(undefined)
  const invitationError = ref<string | null>(null)

  // Si déjà connecté, rediriger vers home
  onMounted(() => {
    if (isAuthenticated.value) {
      router.push('/')
    }
  })

  // État pour déterminer si le compte existe déjà
  const accountExists = ref(false)
  const isCheckingEmail = ref(false)

  // Schema pour création de compte
  const registerSchema = z
    .object({
      firstName: z.string().min(1, 'Prénom requis').describe('Prénom'),
      lastName: z.string().min(1, 'Nom requis').describe('Nom'),
      email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
      password: z.string().min(1, 'Mot de passe requis'),
      confirm: z.string().min(1, 'Mot de passe requis'),
    })
    .refine((data) => data.password === data.confirm, {
      message: 'Les mot de passe ne correspondent pas.',
      path: ['confirm'],
    })

  // Schema pour lier un compte existant
  const linkSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
    password: z.string().min(1, 'Mot de passe requis'),
  })

  const handleRegister = async ({
    email,
    firstName,
    lastName,
    password,
  }: {
    email: string
    firstName: string
    lastName: string
    password: string
    confirm: string
  }) => {
    try {
      // Note: Un nickname temporaire sera généré automatiquement
      // L'utilisateur pourra le personnaliser dans son profil après connexion
      // Passer le token d'invitation pour assigner le bon rôle
      await register({ email, firstName, lastName, password, invitationToken: invitationToken.value ?? undefined })
      toast.success('Compte créé avec succès')

      // Reload page to trigger SSR + middleware redirect
      window.location.href = '/'
    } catch (error) {
      const err = error as { status?: number; data?: { message?: string } }
      if (err?.status === 409 || err?.status === 500) {
        const message = err?.data?.message || ''
        if (message.includes('duplicate') || message.includes('already exists')) {
          toast.error('Un compte associé à cet email existe déjà')
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

  const handleLinkAccount = async ({ email, password }: { email: string; password: string }) => {
    try {
      if (!invitationToken.value) {
        toast.error("Token d'invitation manquant")
        return
      }

      await linkAccountWithInvitation({
        email,
        password,
        invitationToken: invitationToken.value,
      })

      toast.success('Compte lié avec succès ! Bienvenue sur Face B.')

      // Reload page to trigger SSR + middleware redirect
      window.location.href = '/'
    } catch (error) {
      const err = error as { status?: number; data?: { message?: string } }
      if (err?.status === 401) {
        toast.error('Mot de passe incorrect')
      } else if (err?.status === 400) {
        toast.error(err?.data?.message || 'Erreur de liaison du compte')
      } else {
        toast.error('Une erreur est survenue')
      }
    }
  }

  // Clé pour forcer la re-création du formulaire
  const formKey = computed(() => {
    const prefix = accountExists.value ? 'link' : 'register'
    return emailPrefill.value ? `${prefix}-with-email` : `${prefix}-without-email`
  })

  // Valeurs par défaut du formulaire inscription
  const registerDefaults = computed(() => ({
    firstName: '',
    lastName: '',
    email: emailPrefill.value || '',
    password: '',
    confirm: '',
  }))

  // Valeurs par défaut du formulaire liaison
  const linkDefaults = computed(() => ({
    email: emailPrefill.value || '',
    password: '',
  }))

  onMounted(async () => {
    if (invitationToken.value) {
      try {
        const { mutateAsync } = tokenValidation.value || {}
        if (mutateAsync) {
          const data = await mutateAsync({ token: invitationToken.value })
          emailPrefill.value = data?.email || undefined

          // Vérifier si le compte existe déjà
          if (emailPrefill.value) {
            isCheckingEmail.value = true
            try {
              const result = await checkEmailExists(emailPrefill.value)
              accountExists.value = result.exists
            } catch {
              // En cas d'erreur, on assume que le compte n'existe pas
              accountExists.value = false
            } finally {
              isCheckingEmail.value = false
            }
          }
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
  <AuthBox :title="accountExists ? 'Lier votre compte' : 'Création de compte'">
    <!-- Loading state pendant la vérification -->
    <div v-if="isCheckingEmail" class="flex items-center justify-center py-8">
      <div class="text-muted-foreground">Vérification en cours...</div>
    </div>

    <!-- Message informatif pour liaison de compte -->
    <div v-else-if="accountExists && !invitationError" class="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
      <p class="text-sm">
        <strong>Vous avez déjà un compte Nina.fm !</strong>
        <br />
        Connectez-vous avec votre mot de passe pour activer votre accès à Face B.
      </p>
    </div>

    <!-- Formulaire de liaison de compte (compte existe déjà) -->
    <AutoForm
      v-if="accountExists && !isCheckingEmail"
      :key="'link-' + formKey"
      class="space-y-6"
      :schema="linkSchema"
      :default-values="linkDefaults"
      :field-config="{
        email: {
          label: 'Email',
          inputProps: {
            type: 'email',
            autocomplete: 'email',
            readonly: true,
          },
        },
        password: {
          label: 'Mot de passe',
          inputProps: {
            type: 'password',
            autocomplete: 'current-password',
          },
        },
      }"
      @submit="handleLinkAccount"
    >
      <div class="flex flex-col items-center gap-5">
        <div class="flex gap-2">
          <Button :disabled="!!invitationError" type="submit">Activer Face B</Button>
        </div>
        <div class="flex gap-2 text-xs">
          <NuxtLink to="/forgot-password">Mot de passe oublié ?</NuxtLink>
        </div>
      </div>
    </AutoForm>

    <!-- Formulaire de création de compte (nouveau compte) -->
    <AutoForm
      v-else-if="!isCheckingEmail"
      :key="'register-' + formKey"
      class="space-y-6"
      :schema="registerSchema"
      :default-values="registerDefaults"
      :field-config="{
        firstName: {
          label: 'Prénom',
          inputProps: {
            type: 'text',
          },
        },
        lastName: {
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
      @submit="handleRegister"
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
