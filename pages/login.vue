<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ layout: 'naked', auth: false })

  const { login } = useAuthActions()
  const router = useRouter()

  const formSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
    password: z.string().min(1, 'Mot de passe requis'),
  })

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const { email, password } = values
      if (!email || !password) {
        toast.error('Email et mot de passe requis')
        return
      }
      await login(email, password)
      toast.success('Connexion réussie')
      await router.push('/') // Redirect to home after login
    } catch (error) {
      if ((error as { status?: number }).status === 401) {
        toast.error('Email ou mot de passe incorrect')
      } else {
        toast.error('Une erreur est survenue')
      }
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (url.searchParams.get('error') === 'invitation_required') {
        toast.error("Lien d'invitation requis pour accéder à l'inscription.")
        url.searchParams.delete('error')
        window.history.replaceState({}, '', url.pathname + url.search)
      }
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
