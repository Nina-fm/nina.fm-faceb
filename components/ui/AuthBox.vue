<script lang="ts" setup>
defineProps({
  title: String
})

const config = useRuntimeConfig()

</script>

<template>
  <v-card class="n-auth-box" :title="title" :subtitle="config.public.sitename">
    <v-card-text>
      <slot />
    </v-card-text>
    <v-card-actions>
      <slot name="footer" />
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
.n-auth-box {
  :deep(.v-card-title) {
    text-align: center;
  }

  :deep(.v-card-subtitle) {
    text-align: center;

  }

  :deep(.pre-footer) {
    display: flex;
    justify-content: center;
  }

  :deep(.v-card-actions) {
    justify-content: center;
    padding-bottom: 20px
  }
}
</style>
