<script lang="ts" setup>
  defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [email: string]
  }>()

  const handleSubmit = async (email: string) => {
    emit('update:modelValue', false)
    emit('submit', email)
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
