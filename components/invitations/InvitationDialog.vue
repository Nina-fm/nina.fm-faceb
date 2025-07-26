<script lang="ts" setup>
  defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [payload: { email: string; message?: string }]
  }>()

  const handleSubmit = async (payload: { email: string; message?: string }) => {
    emit('update:modelValue', false)
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
