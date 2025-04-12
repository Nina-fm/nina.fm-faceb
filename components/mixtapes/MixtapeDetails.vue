<script lang="ts" setup>
  import type { MixtapeExt } from '~/types/supatypes'

  defineProps<{
    mixtape: MixtapeExt
  }>()
</script>

<template>
  <div class="py-10">
    <Card class="bg-foreground/3 border-none">
      <CardHeader>
        <div class="flex gap-5">
          <div class="aspect-square size-40 overflow-hidden rounded">
            <img v-if="mixtape?.cover_url" :src="mixtape.cover_url" alt="cover" class="object-contain" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="text-3xl font-bold">{{ mixtape?.name }}</div>
            <div class="text-muted-foreground text-sm font-light tracking-wide">
              Mixée en {{ mixtape?.year }} par {{ mixtape?.authors_text }}
            </div>
            <div>
              <Badge v-for="tag in mixtape?.tags" :key="tag.name" variant="secondary">{{ tag.name }}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MixtapeTracksTable :data="mixtape.tracks" />
      </CardContent>
    </Card>
  </div>
</template>
