<script setup lang="ts">
  import { onMounted } from 'vue'
  import { toast } from 'vue-sonner'

  definePageMeta({
    breadcrumb: {
      label: 'Accueil',
    },
  })

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const error = url.searchParams.get('error')

      if (error === 'invitation_required') {
        toast.error("Lien d'invitation requis pour accéder à l'inscription.")
      } else if (error === 'forbidden') {
        toast.error('Accès refusé', {
          description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        })
      }

      // Nettoyer l'URL
      if (error) {
        url.searchParams.delete('error')
        window.history.replaceState({}, '', url.pathname + url.search)
      }
    }
  })
</script>

<template>
  <div class="container flex h-full flex-col items-center justify-center">
    <div
      class="spin bg-primary relative flex aspect-square size-80 flex-col items-center justify-center rounded-full text-neutral-900"
    >
      <div class="flex h-1/2 w-full flex-col items-center justify-end pb-12">
        <h1 class="text-3xl font-bold">Face B</h1>
      </div>
      <div class="flex h-1/2 w-full flex-col items-center justify-start pt-10">
        <p>Vous êtes sur</p>
        <p>l'admin de Nina.fm</p>
      </div>
      <div class="absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-900" />
    </div>
  </div>
</template>

<style scoped>
  .spin {
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
