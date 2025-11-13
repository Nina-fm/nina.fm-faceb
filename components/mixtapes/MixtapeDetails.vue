<script lang="ts" setup>
  import { UserRoundIcon } from 'lucide-vue-next'
  import type { Mixtape } from '~/types/api/mixtapes.types'

  const props = defineProps<{
    mixtape: Mixtape
  }>()

  const { getImageUrl } = useImageApi()
  const djsText = computed(() => props.mixtape.djs?.map((dj) => dj.name).join(', ') || '-')
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardHeader>
        <div class="flex gap-5">
          <div v-if="props.mixtape?.cover" class="">
            <Avatar class="size-38 rounded-lg">
              <AvatarImage :src="getImageUrl(props.mixtape.cover) || ''" :alt="props.mixtape.cover.originalName" />
              <AvatarFallback class="bg-muted text-muted-foreground rounded-lg">
                <UserRoundIcon class="size-14" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-3xl font-bold">{{ mixtape?.name }}</div>
            <div class="text-muted-foreground text-sm font-light tracking-wide">
              Mixée en {{ mixtape?.year }} par {{ djsText }}
            </div>
            <!-- <div>
              <Badge v-for="tag in mixtape?.tags" :key="tag.name" variant="secondary">{{ tag.name }}</Badge>
            </div> -->
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <!-- <MixtapeTracksTable :data="mixtape.tracks" /> -->
        <div>
          <pre class="text-xs leading-5">{{ mixtape?.tracksAsText }}</pre>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
