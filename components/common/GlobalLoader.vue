<script setup lang="ts">
  // GlobalLoader simplifié - plus besoin de tracker isAuthChecking
  // L'auth est maintenant chargée en SSR via server/middleware/auth.ts
  // Chaque query/mutation a son propre isPending avec TanStack Query
</script>

<template>
  <!-- Loader désactivé - auth géré en SSR, queries ont leur propre loading -->
  <div />
</template>
