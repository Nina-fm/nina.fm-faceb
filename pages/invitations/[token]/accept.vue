<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const { params } = useRoute()
  const { register, getInvitationByToken } = useAuth()

  const token = ref(Array.isArray(params.token) ? params.token[0] : params.token)

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

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
  })

  const handleError = (error: any) => {
    if (error?.response?.status === 401) {
      toast.error('Email ou mot de passe incorrect')
    } else {
      toast.error('Une erreur est survenue')
    }
  }

  const handleSubmit = async ({ email, name, password }: Record<string, any>) => {
    try {
      await register({ email, name, password, invitationToken: token.value })
      form.resetForm()
      await navigateTo('/')
      toast.success('Votre compte a été créé avec succès !')
    } catch (error) {
      handleError(error)
    }
  }

  onBeforeMount(async () => {
    const invitation = await getInvitationByToken(token.value)

    if (!invitation) {
      toast.error("Cette invitation n'existe pas ou a déjà été utilisée.")
      await navigateTo('/login')
    }

    form.setFieldValue('email', invitation.email)
  })
</script>

<template>
  <AuthBox title="Création de compte">
    <AutoForm
      class="space-y-6"
      :schema="formSchema"
      :form="form"
      :default-values="{
        name: '',
        email: '',
        password: '',
        confirm: '',
      }"
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
          <Button type="submit">Créer le compte</Button>
        </div>
        <div class="flex gap-2 text-xs">
          <NuxtLink to="/login">Déjà un compte ?</NuxtLink>
        </div>
      </div>
    </AutoForm>
  </AuthBox>
</template>
