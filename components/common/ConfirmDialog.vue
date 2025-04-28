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
        <AlertDialogTitle>{{ title ?? 'Attention ! Suppression irréversible.' }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{
            description ??
            `Vous êtes sur le point de supprimer cet élément. Cette action est irréversible et supprimera toutes les
          données associées. Confirmez-vous votre volonté d'effectuer cette suppression ?`
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
