<script lang="ts" setup>
  const navigation = useNavigation()
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="flex flex-row items-center justify-between">
      <SidebarMenuButton variant="default" as-child class="">
        <NuxtLink to="/" class="inline-flex gap-2 group-data-[collapsible=icon]:hidden">
          <span class="text-primary text-xl font-bold">Face B</span>
          <span class="mt-1.5 text-xs font-light tracking-wider opacity-60">Nina.fm</span>
        </NuxtLink>
      </SidebarMenuButton>
      <SidebarTrigger class="text-muted-foreground size-8" />
    </SidebarHeader>
    <SidebarContent class="pt-14">
      <template v-if="navigation">
        <SidebarGroup v-for="group in navigation" :key="group.label">
          <SidebarGroupLabel class="text-sidebar-foreground/20 group-data-[collapsible=icon]:hidden">
            {{ group.label }}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in group.children" :key="item.label">
                <SidebarMenuButton as-child :is-active="item.to === $route.path">
                  <NuxtLink :to="item.to">
                    <component :is="item.icon" />
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
                <SidebarMenuAction v-if="item?.action" as-child>
                  <NuxtLink :to="item.action.to">
                    <component :is="item.action.icon" />
                  </NuxtLink>
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </template>
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
