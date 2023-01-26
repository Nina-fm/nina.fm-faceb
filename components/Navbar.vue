<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue'

const config = useRuntimeConfig()
const { logout } = useAuthStore();
const { user, isLoggedIn } = storeToRefs(useAuthStore());
const route = useRoute()
const activeRoute = ref(route.path || '/')

const handleSelect = (key: string, keyPath: string[]) => {
  if (key) {
    activeRoute.value = key
    navigateTo(key)
  } else {
    activeRoute.value = activeRoute.value
  }
}

const handleLogout = async () => {
  await logout()
  navigateTo("/login")
}

</script>

<template>
  <client-only>
    <el-menu :default-active="activeRoute" class="nina-navbar" mode="horizontal" :ellipsis="false"
      @select="handleSelect">
      <el-menu-item index="/" class="brand">
        {{ config.public.sitename }}
      </el-menu-item>
      <div class="flex-grow" />
      <el-menu-item index="/mixtapes">
        Mixtapes
      </el-menu-item>
      <el-sub-menu v-if="isLoggedIn" index="">
        <template #title>
          <el-avatar class="avatar-icon" size="small" :icon="ElIconUserFilled" />
        </template>
        <el-menu-item disabled>{{ user?.email }}</el-menu-item>
        <el-menu-item @click="handleLogout" index="">Se déconnecter</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </client-only>
</template>

<style scoped >
.brand {
  font-weight: bold;
  font-size: 1rem;
}

.avatar-icon {
  background-color: var(--el-color-info-light-7);
}

.avatar-icon :deep(.el-icon) {
  font-size: 0.9em;
  margin-right: 0px;

}
</style>
