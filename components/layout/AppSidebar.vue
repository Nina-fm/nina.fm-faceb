<script lang="ts" setup>
  import { CircleUserIcon } from 'lucide-vue-next'
  import DropdownMenuLabel from '~/components/ui/dropdown-menu/DropdownMenuLabel.vue'

  const { user } = useAuthStoreRefs()
  const { logout } = useAuthStore()
  const { profile } = useProfileStoreRefs()
  const { navigation } = useAppConfig()

  const handleLogout = async () => {
    await logout()
  }
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="flex flex-row items-center justify-between">
      <SidebarMenuButton variant="default" asChild class="">
        <NuxtLink to="/" class="inline-flex gap-2 group-data-[collapsible=icon]:hidden">
          <span class="text-xl font-bold">Face B</span>
          <span class="mt-1.5 text-xs font-light tracking-wider opacity-60">Nina.fm</span>
        </NuxtLink>
      </SidebarMenuButton>
      <SidebarTrigger class="text-muted-foreground size-8" />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-if="navigation" v-for="group in navigation" :key="group.label">
        <SidebarGroupLabel class="text-sidebar-foreground/20">{{ group.label }}</SidebarGroupLabel>
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
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton variant="default">
                <div class="flex items-center gap-2">
                  <CircleUserIcon class="size-4" />
                  <span>{{ profile?.name }}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
              <DropdownMenuLabel>
                <span class="text-muted-foreground flex">{{ profile?.name }}</span>
                <span class="text-primary/80 text-xs">{{ user?.email }}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <NuxtLink to="/profile">
                    <span>Mon profil</span>
                  </NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NuxtLink to="/settings">
                    <span>Paramètres</span>
                  </NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLogout">
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
