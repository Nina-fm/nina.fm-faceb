<script lang="ts" setup>
  import { DiscAlbumIcon } from 'lucide-vue-next'

  const props = defineProps<{
    tracksAsText?: string
  }>()

  const tracks = computed(() => {
    if (!props.tracksAsText) return []

    return props.tracksAsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, index) => ({
        id: index,
        text: line,
      }))
  })

  const hasNoTracks = computed(() => tracks.value.length === 0)
</script>

<template>
  <div v-if="hasNoTracks" class="text-muted-foreground py-8 text-center text-sm">
    <DiscAlbumIcon class="mx-auto mb-2 size-8 opacity-30" />
    <p>Aucune piste renseignée</p>
  </div>
  <div v-else class="space-y-1">
    <div
      v-for="track in tracks"
      :key="track.id"
      class="hover:bg-muted/50 group flex items-start gap-3 rounded-md px-3 py-2 transition-colors"
    >
      <span class="text-muted-foreground mt-0.5 flex-shrink-0 text-xs font-medium tabular-nums">
        {{ String(track.id + 1).padStart(2, '0') }}
      </span>
      <span class="flex-1 text-sm leading-relaxed">
        {{ track.text }}
      </span>
    </div>
  </div>
</template>
