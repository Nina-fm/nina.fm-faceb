<script lang="ts" setup>
  import type { InvitationFormData } from './invitation.schema'

  defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [payload: InvitationFormData]
  }>()

  const handleSubmit = (payload: InvitationFormData) => {
    // Émettre seulement l'événement submit, le parent gérera la fermeture
    emit('submit', payload)
  }
</script>

<template>
  <ClientOnly>
    <Dialog :open="modelValue" @update:open="(value: boolean) => emit('update:modelValue', value)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inviter un utilisateur</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <InvitationForm @submit="handleSubmit" />
      </DialogContent>
    </Dialog>
  </ClientOnly>
</template>
