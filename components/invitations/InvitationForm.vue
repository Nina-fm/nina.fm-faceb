<script lang="ts" setup>
  import { toast } from 'vue-sonner';
import * as z from 'zod';

  const emit = defineEmits<{
    (e: 'submit', email: string): void | Promise<void>
  }>()

  const { createInvitation } = useInvitationApi()

  const formSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
  })

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
  })

  const handleSubmit = async ({ email }: Record<string, any>) => {
    try {
      await createInvitation(email)
      form.resetForm()
      emit('submit', email)
      toast.success("Si un compte correspond à cet email, un lien d'invitation y a été envoyé !")
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de l'invitation.")
    }
  }
</script>

<template>
  <AutoForm class="space-y-6" :schema="formSchema" :form="form" @submit="handleSubmit">
    <div class="flex flex-col items-center gap-5">
      <div class="flex gap-2">
        <Button type="submit">Envoyer l'invitation</Button>
      </div>
    </div>
  </AutoForm>
</template>

<style></style>
