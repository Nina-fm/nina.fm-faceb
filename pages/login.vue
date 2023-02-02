<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';

definePageMeta({ layout: "naked" });

const { login } = useAuthStore()
const { isLoggedIn } = storeToRefs(useAuthStore())
const valid = ref(false);
const form = reactive({
  email: '',
  password: ''
})

watchEffect(() => {
  if (!!isLoggedIn.value) {
    navigateTo("/");
  }
})

const handleLogin = async () => {
  await login({ email: form.email, password: form.password });
}
</script>

<template>
  <auth-box title="Connexion">
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field @keydown.enter="handleLogin" v-model="form.email" type="email" label="Email"
              required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field @keydown.enter="handleLogin" v-model="form.password" type="password" label="Mot de passe"
              required></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <div class="pre-footer">
      <nuxt-link to="/reset-password">Mot de passe oublié ?</nuxt-link>
    </div>
    <template #footer>
      <v-btn color="primary" @click="handleLogin">
        Se connecter
      </v-btn>
    </template>
  </auth-box>
</template>

<style scoped>

</style>
