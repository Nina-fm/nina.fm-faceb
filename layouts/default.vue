<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="background-image w-full px-10 py-8">
      <div class="h-full w-full">
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>
