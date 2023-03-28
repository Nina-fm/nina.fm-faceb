<script lang="ts" setup>
definePageMeta({ layout: "naked" })

const { snackSuccess } = useSnackbarStore()
const { sendPasswordRestEmail } = useAuthStore()
const valid = ref(false)
const form = reactive({
  email: "",
})

const handleCancel = () => {
  navigateTo("/login")
}

const handleResetPassword = async () => {
  const { error } = await sendPasswordRestEmail(form.email)
  if (!error) {
    snackSuccess("Si un compte correspond à cet email, un lien de réinitialisation y a été envoyé !")
  }
}
</script>

<template>
  <auth-box title="Mot de passe oublié">
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="form.email" type="email" label="Email" required></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <template #footer>
      <span class="dialog-footer">
        <v-btn variant="text" @click="handleCancel"> Annuler </v-btn>
        <v-btn variant="tonal" @click="handleResetPassword"> Réinitialiser </v-btn>
      </span>
    </template>
  </auth-box>
</template>

<style scoped></style>
