<script lang="ts" setup>
  import { type User, Role } from '@prisma/client';

  const props = defineProps<{
    user: User
  }>()

  const { user: currentUser } = useAuth()

  const isMe = computed(() => currentUser.value?.id === props.user?.id)
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent>
        <div class="flex gap-5">
          <div class="flex w-full flex-col gap-2">
            <div class="flex w-full items-center justify-between">
              <div :class="cn('text-3xl font-bold', { 'text-muted-foreground': !props.user?.name })">
                {{ props.user?.name ?? 'Sans nom…' }}
              </div>
              <Badge v-if="isMe">Moi</Badge>
            </div>
            <div class="mt-5 flex flex-col gap-2">
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Email</span>
                <span class="text-foreground">
                  {{ props.user?.email }}
                </span>
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Rôles</span>
                <span class="text-foreground space-x-2">
                  <Badge
                    v-for="role in props.user?.roles"
                    :key="role"
                    :variant="role === Role.ADMIN ? 'warningMuted' : 'infoMuted'"
                    class="text-[10px] font-light tracking-wider"
                  >
                    {{ role }}
                  </Badge>
                </span>
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Inscrit le</span>
                <span class="text-foreground">
                  {{ new Date(props.user?.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' }) }}
                </span>
              </div>
              <div v-if="props.user?.emailVerified" class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Email vérifié le</span>
                <span class="text-foreground">
                  {{ new Date(props.user.emailVerified).toLocaleDateString('fr-FR', { dateStyle: 'long' }) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
