<script lang="ts" setup>
  import type { User } from '~/types/db'

  const props = defineProps<{
    user: {
      name?: User['name']
      email?: User['email']
      avatar?: User['avatar']
    }
  }>()

  const letter = computed(() => props.user.name?.slice(0, 1) ?? '')
  const avatarUrl = computed(() =>
    props.user.avatar?.filename ? getImagePublicUrl(props.user.avatar.filename) : undefined,
  )
  const avatarAlt = computed(() => props.user.avatar?.alt ?? props.user.name ?? '')
</script>

<template>
  <Avatar class="h-8 w-8 rounded-full">
    <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="avatarAlt" />
    <AvatarFallback class="bg-primary text-primary-foreground rounded-lg">{{ letter }}</AvatarFallback>
  </Avatar>
  <div class="grid flex-1 text-left text-sm leading-tight">
    <span class="truncate font-semibold">{{ user.name }}</span>
    <span class="text-muted-foreground truncate text-[10px]">{{ user.email }}</span>
  </div>
</template>
