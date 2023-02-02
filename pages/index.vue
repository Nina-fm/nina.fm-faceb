<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })
</script>

<template>
  <el-container class="content">
    <h1>Welcome!</h1>
    <p>Bienvenue sur <b>Face B</b>, la face caché de Nina…</p>
    <p>L'admin de Nina.fm quoi !</p>
  </el-container>
</template>

<style scoped>
.content {
  text-align: center;
}
</style>
