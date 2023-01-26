<script lang="ts" setup>
const props = defineProps({
  title: String
})

const config = useRuntimeConfig()
const dialogVisible = ref(true)

</script>

<template>
  <el-dialog class="auth-modal" v-model="dialogVisible" center align-center width="30%" :show-close="false"
    :close-on-click-modal="false" :close-on-press-escape="false" :modal="false">
    <template #title>
      <span class="sitename">{{ config.public.sitename }}</span>
      <span class="el-dialog-title">{{ title }}</span>
    </template>
    <slot />

    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
