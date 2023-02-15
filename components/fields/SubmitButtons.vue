<script lang="ts" setup>
const props = defineProps<{
  cancelText?: string,
  submitText?: string,
  disabled?: boolean,
  edit?: boolean,
}>()

defineEmits<{
  (e: 'cancel'): void,
  (e: 'submit'): void,
}>()

const { edit, submitText, cancelText } = props;
const { disabled = false } = toRefs(props);
const drawer = ref(true);
const cancelButtonText = computed(() => cancelText ?? "Annuler")
const submitButtonText = computed(() => submitText ?? (edit ? 'Mettre à jour' : 'Ajouter'))
</script>

<template>
  <v-navigation-drawer class="bottom-bar" rail floating v-model="drawer" location="bottom" permanent :elevation="10"
    color="background">
    <v-container class="d-flex align-center h-100 py-0 px-8">
      <v-row>
        <v-col cols="12" class="d-flex justify-end py-0">
          <v-btn :disabled="disabled" variant="plain" @click="$emit('cancel')">{{ cancelButtonText }}</v-btn>
          <v-btn :prepend-icon="`mdi-database-${edit ? 'sync' : 'plus'}`" variant="tonal" color="primary"
            :disabled="disabled" @click="$emit('submit')"> {{ submitButtonText }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<style>

</style>
