<script lang="ts" setup>
definePageMeta({ middleware: ["auth"] })
</script>

<template>
  <v-container class="d-flex h-100 align-center">
    <v-row align-content="center">
      <v-col class="d-flex justify-center">
        <v-avatar color="primary" :size="300">
          <div class="rotate d-flex flex-column align-center">
            <h1>Face B</h1>
            <v-avatar color="background" :size="30" class="my-5" />
            <p>Vous êtes sur</p>
            <p>l'admin de Nina.fm</p>
          </div>
        </v-avatar>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.rotate {
  animation: rotation 8s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
