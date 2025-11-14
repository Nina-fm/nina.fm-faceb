<script lang="ts" setup>
  import { DiscAlbumIcon } from 'lucide-vue-next'

  const props = defineProps<{
    tracksAsText?: string
  }>()

  const tracks = computed(() => parseTracks(props.tracksAsText || ''))

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
      :key="track.position"
      :class="
        cn('hover:bg-muted/50 group flex items-start gap-3 rounded-md px-3 py-2 transition-colors', {
          'text-muted-foreground italic': track.artist.toLowerCase() === 'interlude',
        })
      "
    >
      <span class="text-muted-foreground mt-0.5 flex-shrink-0 text-xs font-medium tabular-nums">
        {{ String(track.position).padStart(2, '0') }}
      </span>
      <span class="flex-1 text-sm leading-relaxed">
        {{ track.artist }}
      </span>
      <span class="flex-2 text-sm leading-relaxed">
        {{ track.title }}
      </span>
      <span class="whitespace-no-wrap text-sm leading-relaxed">
        {{ track.start_at }}
      </span>
    </div>
  </div>
</template>
