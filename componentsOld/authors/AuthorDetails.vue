<script lang="ts" setup>
  import type { AuthorExt } from '~/types/supatypes'

  const props = defineProps<{
    author: AuthorExt
  }>()

  const { profile: currentProfile } = useProfileStoreRefs()
  const profile = useUserProfile(props.author.user_id)
  const isMe = computed(() => currentProfile.value?.id === profile.value?.id)
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardContent>
        <div class="flex gap-5">
          <div class="flex flex-col gap-2">
            <div class="text-3xl font-bold">{{ author?.name }}</div>
            <div v-if="profile" class="flex flex-col gap-2">
              <div class="text-muted-foreground text-xs">Ce DJ dispose d'un compte utilisateur.</div>
              <div class="flex gap-2">
                <Badge>{{ profile.name }}{{ isMe ? ' (Moi)' : '' }}</Badge>
                <Badge variant="secondary">{{ profile.email }}</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
