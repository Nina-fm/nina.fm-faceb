<script lang="ts" setup>

definePageMeta({ layout: "auth" });

const { update, user } = useAuthStore();
const dialogVisible = ref(true)
const form = reactive({
  password: '',
})

const handleSavePassword = async () => {
  await update({ password: form.password });
  navigateTo("/")
}

onMounted(() => {
  if (!user) {
    navigateTo("/login")
  }
})
</script>

<template>
  <el-dialog class="auth-modal" v-model="dialogVisible" title="Mot de passe" center align-center width="30%"
    :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" :modal="false">
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
