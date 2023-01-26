<script lang="ts" setup>

definePageMeta({ layout: "auth" });

const { sendPasswordRestEmail } = useAuthStore();
const form = reactive({
  email: '',
})

const handleCancel = () => {
  navigateTo("/login");
}

const handleResetPassword = async () => {
  const { error } = await sendPasswordRestEmail(form.email);
  if (!error) {
    ElMessage.success({ message: "Si un compte correspond à cet email, un lien de réinitialisation y a été envoyé !", duration: 5000 })
  }
}

</script>

<template>
  <auth-box title="Mot de passe oublié">
    <el-form :model="form" label-width="75px" @submit.prevent label-position="top">
      <el-form-item>
        <el-input v-model="form.email" type="email" placeholder="Votre email..." @keyup.enter="handleResetPassword" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="info" @click="handleCancel">
          Annuler
        </el-button>
        <el-button type="primary" @click="handleResetPassword">
          Réinitialiser
        </el-button>
      </span>
    </template>
  </auth-box>
</template>

<style scoped>

</style>
