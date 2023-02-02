<script lang="ts" setup>
import { storeToRefs } from 'pinia';

definePageMeta({ layout: "naked" });

const { user } = storeToRefs(useAuthStore());
const { update } = useAuthStore();
const valid = ref(false);
const form = reactive({
  password: '',
})

watchEffect(() => {
  if (!user.value) {
    return navigateTo('/login');
  }
});

const handleSavePassword = async () => {
  await update({ password: form.password });
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
        <v-btn color="primary" @click="handleSavePassword">
          Continuer
        </v-btn>
      </span>
    </template>
  </auth-box>
</template>

<style scoped>

</style>
