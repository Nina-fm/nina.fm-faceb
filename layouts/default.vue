<script lang="ts" setup>


</script>

<template>
  <v-app>
    <Navbar />
    <v-main class="app-main background-image">
      <v-container class="h-100">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
