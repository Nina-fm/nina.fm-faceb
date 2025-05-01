<script setup lang="ts">
  import { ChevronsUpDown, CogIcon, IdCardIcon, LogOut } from 'lucide-vue-next'
  import { useSidebar } from '~/components/ui/sidebar'

  const { isMobile } = useSidebar()
  const { logout, user } = useAuth()

  const currentUser = computed(() => ({
    name: user.value?.name,
    email: user.value?.email,
    avatar: user.value?.avatar,
  }))

  const handleLogout = async () => {
    await logout()
  }
</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserSlimCard :user="currentUser" />
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-60 rounded-lg"
          :side="isMobile ? 'bottom' : 'top'"
          :side-offset="4"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IdCardIcon />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CogIcon />
              Préférences
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
