<script lang="ts" setup>
  import { KeyRoundIcon, XIcon } from 'lucide-vue-next'
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  definePageMeta({ requiresRoles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR, Role.VIEWER] })

  const { user: currentUser } = useAuth()
  const currentUserId = computed(() => currentUser.value?.id || '')
  const { changePassword } = useUserApi()

  useBreadcrumbItems({
    overrides: [
      undefined,
      {
        label: 'Mon profil',
      },
      {
        label: 'Changer mon mot de passe',
      },
    ],
  })

  const formSchema = z
    .object({
      oldPassword: z.string().min(1, 'Mot de passe actuel requis'),
      newPassword: z.string().min(1, 'Nouveau mot de passe requis'),
      confirmPassword: z.string().min(1, 'Confirmation requise'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    })

  const handleCancel = async () => {
    await navigateTo('/profile')
  }

  const handleSubmit = async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    try {
      await changePassword.mutateAsync({
        userId: currentUserId.value,
        payload: {
          oldPassword,
          newPassword,
        },
      })

      toast.success('Mot de passe modifié avec succès')
      await navigateTo('/profile')
    } catch (error) {
      const err = error as { status?: number; data?: { message?: string } }
      if (err?.status === 400) {
        toast.error('Le mot de passe actuel est incorrect')
      } else {
        toast.error('Une erreur est survenue')
      }
    }
  }
</script>

<template>
  <PageHeader title="Changer mon mot de passe">
    <template #actions>
      <Button size="fab" variant="outline" @click="handleCancel">
        <XIcon />
      </Button>
    </template>
  </PageHeader>

  <div class="py-10">
    <Card class="bg-foreground/3 mx-auto max-w-2xl border-none">
      <CardContent>
        <AutoForm
          class="space-y-6"
          :schema="formSchema"
          :field-config="{
            oldPassword: {
              label: 'Mot de passe actuel',
              inputProps: {
                type: 'password',
                autocomplete: 'current-password',
              },
            },
            newPassword: {
              label: 'Nouveau mot de passe',
              inputProps: {
                type: 'password',
                autocomplete: 'new-password',
              },
            },
            confirmPassword: {
              label: 'Confirmer le nouveau mot de passe',
              inputProps: {
                type: 'password',
                autocomplete: 'new-password',
              },
            },
          }"
          @submit="handleSubmit"
        >
          <div class="flex justify-end gap-2">
            <Button type="button" variant="outline" @click="handleCancel">Annuler</Button>
            <Button type="submit" :disabled="changePassword.isPending.value">
              <KeyRoundIcon />
              {{ changePassword.isPending.value ? 'Modification...' : 'Changer le mot de passe' }}
            </Button>
          </div>
        </AutoForm>
      </CardContent>
    </Card>
  </div>
</template>
