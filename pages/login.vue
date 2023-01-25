<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';

definePageMeta({ layout: "auth" });

const config = useRuntimeConfig()
const { login } = useAuthStore()
const { isLoggedIn } = storeToRefs(useAuthStore())
const dialogVisible = ref(true)
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
  <el-dialog class="auth-modal" v-model="dialogVisible" center align-center width="30%" :show-close="false"
    :close-on-click-modal="false" :close-on-press-escape="false" :modal="false">
    <template #title>
      <span class="sitename">{{ config.public.sitename }}</span>
      <span class="el-dialog-title">Connexion</span>
    </template>
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
  </el-dialog>
</template>

<style scoped>

</style>
