<script lang="ts" setup>
  const { navigation } = useAppConfig()
  const { hasAnyRole } = useAuth()

  const allowedNavigation = computed(() => navigation.filter((group) => (group.roles ? hasAnyRole(group.roles) : true)))
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="flex flex-row items-center justify-between">
      <SidebarMenuButton variant="default" asChild class="">
        <NuxtLink to="/" class="inline-flex gap-2 group-data-[collapsible=icon]:hidden">
          <span class="text-primary text-xl font-bold">Face B</span>
          <span class="mt-1.5 text-xs font-light tracking-wider opacity-60">Nina.fm</span>
        </NuxtLink>
      </SidebarMenuButton>
      <SidebarTrigger class="text-muted-foreground size-8" />
    </SidebarHeader>
    <SidebarContent class="pt-14">
      <SidebarGroup v-if="navigation" v-for="group in allowedNavigation" :key="group.label">
        <SidebarGroupLabel class="text-sidebar-foreground/20 group-data-[collapsible=icon]:hidden">
          {{ group.label }}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.children" :key="item.label">
              <SidebarMenuButton asChild :isActive="item.to === $route.path">
                <NuxtLink :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </SidebarMenuButton>
              <SidebarMenuAction v-if="'action' in item" asChild>
                <NuxtLink :to="item.action.to">
                  <component :is="item.action.icon" />
                </NuxtLink>
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
