<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, reactive } from 'vue';

definePageMeta({ layout: "auth" });

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
  <client-only>
    <el-dialog class="login-modal" v-model="dialogVisible" title="Authentification" center align-center width="30%"
      :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form" label-width="75px" @submit.prevent>
        <el-form-item label="Email">
          <el-input v-model="form.email" placeholder="Email..." @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" placeholder="Password..." @keyup.enter="handleLogin" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleLogin">
            Connexion
          </el-button>
        </span>
      </template>
    </el-dialog>
  </client-only>
</template>

<style scoped>
.login-modal {
  min-width: 320px;
}
</style>
