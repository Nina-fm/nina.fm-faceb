<script lang="ts" setup>
  const props = defineProps<{
    user: {
      name?: string | null
      email?: string | null
      avatar?: string | null
    }
  }>()
  const letter = computed(() => props.user.name?.slice(0, 1) ?? '')
</script>

<template>
  <Avatar class="h-8 w-8 rounded-full">
    <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
    <AvatarFallback class="bg-primary text-primary-foreground rounded-lg">{{ letter }}</AvatarFallback>
  </Avatar>
  <div class="grid flex-1 text-left text-sm leading-tight">
    <span class="truncate font-semibold">{{ user.name }}</span>
    <span class="text-muted-foreground truncate text-[10px]">{{ user.email }}</span>
  </div>
</template>
