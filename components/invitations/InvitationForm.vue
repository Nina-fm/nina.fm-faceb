<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import * as z from 'zod'

  const emit = defineEmits<{
    (e: 'submit', payload: { email: string; message?: string }): void | Promise<void>
  }>()

  const { sendInvitation } = useInvitationApi()

  const formSchema = z.object({
    email: z.string().email('Email invalide').min(1, 'Email requis').describe('Email'),
    message: z.string().optional().describe('Message'),
  })

  const form = useForm({
    validationSchema: toTypedSchema(formSchema),
  })

  const handleSubmit = async ({ email, message }: { email: string; message?: string }) => {
    try {
      await sendInvitation.mutateAsync({ email, message })
      form.resetForm()
      emit('submit', { email, message })
      toast.success('Invitation envoyée !')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.statusCode === 409) {
        toast.error("Une invitation existe déjà pour cet email ou l'utilisateur est déjà inscrit.")
      } else {
        toast.error("Une erreur est survenue lors de l'envoi de l'invitation.")
      }
    }
  }
</script>

<template>
  <AutoForm
    class="space-y-6"
    :schema="formSchema"
    :form="form"
    :field-config="{
      message: {
        component: 'textarea',
        label: 'Message (optionnel)',
      },
    }"
    @submit="handleSubmit"
  >
    <div class="flex flex-col items-center gap-5">
      <div class="flex gap-2">
        <Button type="submit">Envoyer l'invitation</Button>
      </div>
    </div>
  </AutoForm>
</template>

<style></style>
