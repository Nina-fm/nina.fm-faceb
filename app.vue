<script lang="ts" setup>
import { ID_INJECTION_KEY } from 'element-plus'
import { storeToRefs } from 'pinia';
import fr from "element-plus/dist/locale/fr.mjs"

const { currentRoute } = useRouter()
const { isLoggedIn } = storeToRefs(useAuthStore())
const { isLoading } = storeToRefs(useLoadingStore())
const locale = computed(() => fr)

provide(ID_INJECTION_KEY, {
  prefix: 100,
  current: 0,
})

watchEffect(() => {
  if (!isLoggedIn.value && currentRoute.value.name !== "login") {
    // navigateTo("/login");
  }
})
</script>

<template>
  <el-config-provider :locale="locale">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
    <div v-loading="isLoading"></div>
  </el-config-provider>
</template>

<style scoped>
.el-loading-parent--relative {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3000;
}
</style>




