<script lang="ts" setup>
  import { toast } from 'vue-sonner'
  import type { InvitationFormData } from './invitation.schema'
  import { invitationFormSchema, invitationFormSetValues, roleOptions } from './invitation.schema'

  const emit = defineEmits<{
    (e: 'submit', payload: InvitationFormData): void | Promise<void>
  }>()

  const { sendInvitation } = useInvitationApi()

  const form = useForm({
    validationSchema: toTypedSchema(invitationFormSchema),
    initialValues: invitationFormSetValues(),
  })

  const handleSubmit = async (values: InvitationFormData) => {
    try {
      await sendInvitation.mutateAsync(values)
      form.resetForm()
      emit('submit', values)
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
    :schema="invitationFormSchema"
    :form="form"
    :field-config="{
      email: {
        label: 'Email',
      },
      message: {
        component: 'textarea',
        label: 'Message (optionnel)',
      },
      role: {
        component: 'select',
        label: 'Rôle',
        description: 'Le rôle qui sera attribué automatiquement lors de la création du compte',
      },
    }"
    @submit="handleSubmit"
  >
    <template #role="slotProps">
      <SelectField v-bind="slotProps" name="role" label="Rôle" :options="roleOptions" />
    </template>

    <div class="flex flex-col items-center gap-5">
      <div class="flex gap-2">
        <Button type="submit">Envoyer l'invitation</Button>
      </div>
    </div>
  </AutoForm>
</template>
