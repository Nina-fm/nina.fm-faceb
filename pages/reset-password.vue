<script lang="ts" setup>

definePageMeta({ layout: "auth" });

const { sendPasswordRestEmail, user } = useAuthStore();
const dialogVisible = ref(true)
const form = reactive({
  email: '',
})

const handleResetPassword = async () => {
  await sendPasswordRestEmail(form.email);
  ElMessage.success({ message: "Vérifiez votre boite mail, un lien de réinitialisation y a été envoyé !" })
}

</script>

<template>
  <el-dialog class="auth-modal" v-model="dialogVisible" title="Réinitialisation mot de passe" center align-center
    width="30%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="form" label-width="75px" @submit.prevent>
      <el-form-item label="Email">
        <el-input v-model="form.email" type="email" placeholder="Votre email..." @keyup.enter="handleResetPassword" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleResetPassword">
          Réinitialiser
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
