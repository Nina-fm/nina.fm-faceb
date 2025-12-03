<script lang="ts" setup>
  import { UserRoundIcon } from 'lucide-vue-next'
  import type { User } from '~/types/api/users.types'

  const props = defineProps<{
    user: User
  }>()

  const { user: currentUser } = useAuth()
  const { getThumbnailUrl, getImageUrl } = useImageApi()

  const isMe = computed(() => currentUser.value?.id === props.user?.id)
  const avatarUrl = computed(() => {
    if (props.user?.profile?.avatar) {
      return getThumbnailUrl(props.user.profile.avatar)
    }
    return undefined
  })

  // Lightbox state
  const isLightboxOpen = ref(false)
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent>
        <div class="flex gap-5">
          <div v-if="avatarUrl" class="">
            <Avatar class="size-38 cursor-pointer rounded-full" @click="isLightboxOpen = true">
              <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="user.profile.nickname" />
              <AvatarFallback class="bg-muted text-muted-foreground rounded-full">
                <UserRoundIcon class="size-14" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div class="flex w-full flex-col gap-2">
            <div class="flex w-full items-center justify-between">
              <div :class="cn('text-3xl font-bold', { 'text-muted-foreground': !user?.profile?.nickname })">
                {{ user?.profile?.nickname ?? 'Sans nom…' }}
              </div>
              <Badge v-if="isMe">Moi</Badge>
            </div>
            <div class="mt-5 flex flex-col gap-2">
              <div v-if="user?.profile?.firstName" class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Prénom</span>
                <span class="text-foreground">
                  {{ user.profile.firstName }}
                </span>
              </div>
              <div v-if="user?.profile?.lastName" class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Nom</span>
                <span class="text-foreground">
                  {{ user.profile.lastName }}
                </span>
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Email</span>
                <span class="text-foreground">
                  {{ user?.email }}
                </span>
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Rôles</span>
                <span class="text-foreground space-x-2">
                  <Badge
                    :variant="user.role === Role.ADMIN ? 'warningMuted' : 'infoMuted'"
                    class="text-[10px] font-light tracking-wider"
                  >
                    {{ user.role }}
                  </Badge>
                </span>
              </div>
              <div class="text-muted-foreground flex gap-4 text-sm">
                <span class="text-muted-foreground w-28 font-bold">Inscrit le</span>
                <span class="text-foreground">
                  {{ new Date(user?.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' }) }}
                </span>
              </div>
              <div
                v-if="user?.invitations?.length && user?.invitations?.[0]?.usedAt"
                class="text-muted-foreground flex gap-4 text-sm"
              >
                <span class="text-muted-foreground w-28 font-bold">Email vérifié le</span>
                <span class="text-foreground">
                  {{ new Date(user.invitations[0].usedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' }) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Lightbox -->
    <Lightbox
      v-model:open="isLightboxOpen"
      :src="getImageUrl(props.user.profile.avatar) || ''"
      :alt="props.user.profile.nickname"
    >
      <h2 class="text-center text-xl font-bold">{{ user?.profile?.nickname }}</h2>
    </Lightbox>
  </div>
</template>
