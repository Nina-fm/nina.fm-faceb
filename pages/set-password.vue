<script lang="ts" setup>
import { storeToRefs } from 'pinia';

definePageMeta({ layout: "auth" });

const { user } = storeToRefs(useAuthStore());
const { update } = useAuthStore();
const form = reactive({
  password: '',
})

onMounted(() => {
  setTimeout(() => {
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
  <auth-box title="Mot de passe">
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
  </auth-box>
</template>

<style scoped>

</style>
