<script lang="ts" setup>
  import type { Mixtape } from '~/types/db'

  const props = defineProps<{
    mixtape: Mixtape
  }>()

  const coverUrl = computed(() => {
    return props.mixtape?.cover?.filename ? getImagePublicUrl(props.mixtape.cover.filename) : undefined
  })
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardHeader>
        <div class="flex gap-5">
          <div v-if="coverUrl" class="aspect-square size-40 overflow-hidden rounded">
            <img :src="coverUrl" :alt="mixtape.cover?.alt" class="object-contain" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-3xl font-bold">{{ mixtape?.name }}</div>
            <div class="text-muted-foreground text-sm font-light tracking-wide">
              Mixée en {{ mixtape?.year }} par {{ mixtape?.djsAsText }}
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
