<script lang="ts" setup>
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
  }>()

  defineEmits<{
    (e: 'update:modelValue', value: boolean): void | Promise<void>
    (e: 'cancel'): void | Promise<void>
    (e: 'confirm'): void | Promise<void>
  }>()
</script>

<template>
  <AlertDialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title ?? 'Attention ! Changements non sauvegardés.' }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{
            description ??
            `Vous êtes sur le point de quitter la page sans avoir sauvegardé les changements. 
            Cette action est irréversible et vos changement seront perdus. Confirmez-vous vouloir quitter la page sans sauvegarder ?`
          }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="$emit('cancel')">Annuler</AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirm')">Confirmer</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
