<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';

definePageMeta({ layout: "auth" });

const { login } = useAuthStore()
const { isLoggedIn } = storeToRefs(useAuthStore())
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
    <el-form :model="form" label-width="75px" @submit.prevent label-position="top">
      <el-form-item>
        <el-input v-model="form.email" placeholder="Email..." @keyup.enter="handleLogin" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" placeholder="Password..." @keyup.enter="handleLogin" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="pre-footer">
        <nuxt-link to="/reset-password"><el-link type="info">Mot de passe oublié ?</el-link></nuxt-link>
      </div>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleLogin">
          Se connecter
        </el-button>
      </span>
    </template>
  </auth-box>
</template>

<style scoped>

</style>
