<script setup lang="ts">
  import { ChevronsUpDown, IdCardIcon, LogOut } from 'lucide-vue-next'
  import { useSidebar } from '~/components/ui/sidebar'

  const { isMobile } = useSidebar()
  const { user } = useAuth()
  const { logout } = useAuthActions()
  const { getThumbnailUrl } = useImageApi()

  const currentUser = computed(() => ({
    name: user.value?.profile?.nickname || user.value?.name || 'Utilisateur',
    email: user.value?.email || '',
    avatar: user.value?.profile?.avatar
      ? {
          url: getThumbnailUrl(user.value.profile.avatar),
          alt: user.value?.profile?.nickname || 'Avatar',
        }
      : undefined,
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
            class="data-[state=open]:bg-accent data-[state=open]:text-sidebar-accent-foreground"
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
            <DropdownMenuItem as-child>
              <NuxtLink to="/profile">
                <IdCardIcon />
                Mon profil
              </NuxtLink>
            </DropdownMenuItem>
            <!-- <DropdownMenuItem>
              <CogIcon />
              Préférences
            </DropdownMenuItem> -->
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
