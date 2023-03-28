<script lang="ts" setup>
definePageMeta({ layout: "naked" })

const route = useRoute()

const { update } = useAuthStore()
const valid = ref(false)
const form = reactive({
  password: "",
})

onMounted(() => {
  if (!route.hash) {
    return navigateTo("/login")
  }
})

const handleSavePassword = async () => {
  await update({ password: form.password })
  navigateTo("/")
}
</script>

<template>
  <auth-box title="Mot de passe">
    <v-form v-model="valid" @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="form.password" type="password" label="Nouveau mot de passe" required></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <template #footer>
      <span class="dialog-footer">
        <v-btn variant="tonal" @click="handleSavePassword"> Continuer </v-btn>
      </span>
    </template>
  </auth-box>
</template>

<style scoped></style>
