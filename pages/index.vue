<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })
</script>

<template>
  <el-container>
    <el-main>
      <h1>Welcome!</h1>
      <p>Bienvenue sur <b>Face B</b>, la face caché de Nina…</p>
      <p>L'admin de Nina.fm quoi !</p>
    </el-main>
  </el-container>
</template>

<style scoped>
.el-main {
  text-align: center;
}
</style>
