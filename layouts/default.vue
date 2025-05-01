<script setup lang="ts">
  import { SidebarProvider } from '#components'
  import { SIDEBAR_COOKIE_NAME } from '~/components/ui/sidebar/utils'

  const defaultOpen = useCookie<boolean>(SIDEBAR_COOKIE_NAME)
</script>

<template>
  <SidebarProvider :defaultOpen="defaultOpen">
    <AppSidebar />
    <main class="background-image w-full px-10 py-8">
      <div class="h-full w-full">
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>
