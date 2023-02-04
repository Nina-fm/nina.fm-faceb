<script lang="ts" setup></script>

<template>
  <v-app>
    <v-main class="background-image">
      <v-container class="h-100 d-flex">
        <v-row align="center" justify="center">
          <v-col cols="6">
            <slot />

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
