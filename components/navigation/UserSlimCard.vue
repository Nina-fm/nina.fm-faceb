<script lang="ts" setup>
  import { UserRoundIcon } from 'lucide-vue-next'
  import type { User } from '~/types/db'

  defineProps<{
    user: {
      name?: User['name']
      email?: User['email']
      avatar?: User['avatar']
    }
  }>()
</script>

<template>
  <Avatar class="size-8 rounded-full">
    <AvatarImage v-if="user?.avatar?.url" :src="user?.avatar?.url" :alt="user.avatar.alt" />
    <AvatarFallback class="bg-primary text-primary-foreground rounded-lg">
      <UserRoundIcon class="size-4" />
    </AvatarFallback>
  </Avatar>
  <div class="grid flex-1 text-left text-sm leading-tight">
    <span class="truncate font-semibold">{{ user.name }}</span>
    <span class="text-muted-foreground truncate text-[10px]">{{ user.email }}</span>
  </div>
</template>
