<script lang="ts" setup>
import Navbar from '~~/components/navigation/Navbar.vue';

</script>

<template>
  <div class="nina-layout full-height">
    <el-container>
      <el-header>
        <NavBar />
      </el-header>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>
