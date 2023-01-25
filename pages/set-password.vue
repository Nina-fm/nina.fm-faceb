<script lang="ts" setup>
import { storeToRefs } from 'pinia';

definePageMeta({ layout: "auth" });

const config = useRuntimeConfig()
const { user } = storeToRefs(useAuthStore());
const { update } = useAuthStore();
const dialogVisible = ref(true)
const form = reactive({
  password: '',
})

onMounted(() => {
  setTimeout(() => {
    console.log("onMounted", user.value)
    if (!user.value) {
      navigateTo("/login")
    }
  }, 1000);
})

const handleSavePassword = async () => {
  await update({ password: form.password });
  navigateTo("/")
}
</script>

<template>
  <el-dialog class="auth-modal" v-model="dialogVisible" center align-center width="30%" :show-close="false"
    :close-on-click-modal="false" :close-on-press-escape="false" :modal="false">
    <template #title>
      <span class="sitename">{{ config.public.sitename }}</span>
      <span class="el-dialog-title">Mot de passe</span>
    </template>
    <el-form :model="form" label-width="75px" @submit.prevent label-position="top">
      <el-form-item>
        <el-input v-model="form.password" type="password" placeholder="Choisissez votre mot de passe..."
          @keyup.enter="handleSavePassword" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSavePassword">
          Connexion
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
