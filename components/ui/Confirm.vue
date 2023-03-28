<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "close"): void
  (e: "cancel"): void
  (e: "confirm"): void
}>()

const handleCancel = () => {
  emit("cancel")
  emit("close")
}

const handleConfirm = () => {
  emit("confirm")
  emit("close")
}
</script>

<template>
  <v-dialog :model-value="modelValue" :close-on-back="false" :close-on-content-click="false" persistent max-width="450">
    <v-card>
      <v-toolbar color="warning" :title="title || 'Attention !'"></v-toolbar>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="handleCancel">Annuler</v-btn>
        <v-btn color="warning" @click="handleConfirm">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
