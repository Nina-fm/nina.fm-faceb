<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'submit', email: string): void | Promise<void>
  }>()

  const open = ref(false)

  const handleSubmit = async (email: string) => {
    open.value = false
    emit('submit', email)
  }
</script>

<template>
  <ClientOnly>
    <Dialog v-model:open="open" @update:open="(value) => (open = value)">
      <DialogTrigger>
        <slot />
      </DialogTrigger>
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
