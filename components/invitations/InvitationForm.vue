<script lang="ts" setup>
  import type { InvitationFormData } from './invitation.schema'
  import { invitationFormSchema, invitationFormSetValues, roleOptions } from './invitation.schema'

  const emit = defineEmits<{
    (e: 'submit', payload: InvitationFormData): void | Promise<void>
  }>()

  const form = useForm({
    validationSchema: toTypedSchema(invitationFormSchema),
    initialValues: invitationFormSetValues(),
  })

  const handleSubmit = (values: InvitationFormData) => {
    // Émettre l'événement au parent qui gérera l'appel API
    emit('submit', values)
    form.resetForm()
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
