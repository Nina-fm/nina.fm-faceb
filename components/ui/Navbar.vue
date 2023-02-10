<script lang="ts" setup>
import { storeToRefs } from 'pinia';

const { $version } = useNuxtApp();
const config = useRuntimeConfig()
const { logout } = useAuthStore();
const { user, isLoggedIn } = storeToRefs(useAuthStore());
const showNewVersion = ref(false);

const handleLogout = async () => {
  await logout()
  navigateTo("/login")
}

onMounted(() => {
  if ($version.isNew) {
    setTimeout(() => showNewVersion.value = true, 5000)
  }
})
</script>

<template>
  <v-app-bar color="primary">
    <template #title>
      <nuxt-link class="brand" to="/">{{ config.public.sitename }}</nuxt-link>
      <v-chip class="ml-4" density="comfortable" variant="text">{{ $version.current }}</v-chip>
      <v-slide-x-reverse-transition>
        <v-chip v-if="showNewVersion" color="info" size="small" density="comfortable" variant="flat">New !</v-chip>
      </v-slide-x-reverse-transition>
    </template>
    <template v-slot:append>
      <v-btn size="small" @click="navigateTo('/mixtapes')">Mixtapes</v-btn>
      <v-btn size="small" @click="navigateTo('/authors')">DJ's</v-btn>
      <v-menu v-if="isLoggedIn" open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-account-circle" v-bind="props" variant="plain"></v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title><v-chip color="primary" size="small">{{
              user?.email
            }}</v-chip></v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleLogout">
            <v-list-item-title>Se déconnecter</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped >
:deep(.v-toolbar-title) {
  .brand {
    font-weight: bold;
    letter-spacing: -0.04em;
  }
}
</style>
