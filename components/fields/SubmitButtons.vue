<script lang="ts" setup>
const props = defineProps<{
  cancelText?: string
  submitText?: string
  submitAndCloseText?: string
  disabled?: boolean
  edit?: boolean
  onSubmit?: () => void
  onSubmitAndClose?: () => void
}>()

defineEmits<{
  (e: "cancel"): void
  (e: "submit"): void
  (e: "submit-and-close"): void
}>()

const { edit, submitText, submitAndCloseText, cancelText, disabled = false } = toRefs(props)
const drawer = ref(true)
const cancelButtonText = computed(() => cancelText?.value ?? "Annuler")
const submitButtonText = computed(() => submitText?.value ?? (edit.value ? "Mettre à jour" : "Ajouter"))
const submitAndCloseButtonText = computed(() => submitAndCloseText?.value ?? `${submitButtonText.value} et fermer`)
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    class="bottom-bar"
    rail
    floating
    location="bottom"
    permanent
    :elevation="10"
    color="background"
  >
    <v-container class="d-flex align-center h-100 py-0 px-8">
      <v-row>
        <v-col cols="12" class="d-flex justify-end py-0">
          <v-btn :disabled="disabled" variant="plain" @click="$emit('cancel')">{{ cancelButtonText }}</v-btn>
          <v-btn
            v-if="props?.onSubmit !== undefined"
            :prepend-icon="`mdi-database-${edit ? 'sync' : 'plus'}`"
            variant="tonal"
            color="primary"
            :disabled="disabled"
            @click="$emit('submit')"
          >
            {{ submitButtonText }}</v-btn
          >
          <v-btn
            v-if="props?.onSubmitAndClose !== undefined"
            :prepend-icon="`mdi-database-${edit ? 'sync' : 'plus'}`"
            variant="tonal"
            color="primary"
            :disabled="disabled"
            @click="$emit('submit-and-close')"
          >
            {{ submitAndCloseButtonText }}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
:deep(.v-btn:not(:last-child)) {
  margin-right: 1em;
}
</style>
