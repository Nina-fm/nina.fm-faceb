/**
 * Utilitaires pour la gestion des tracks de mixtapes
 * Format: [numéro] Artiste : Titre (HH:MM:SS)
 */

export interface Track {
  position?: number
  artist: string
  title: string
  start_at?: string | null
}

/**
 * Parse une string tracksAsText en array de Track[]
 * Format attendu: "01 Artist : Title (00:05:12)"
 * Regex existante: /(?<position>\d+\s)?(?<artist>.+?)\s+[\:\-\•]\s+(?<title>.*?)(?=$|\s\((?<start_at>\d{2}\:\d{2}:\d{2})\))/
 */
export function parseTracks(tracksAsText: string): Track[] {
  if (!tracksAsText || tracksAsText.trim() === '') {
    return []
  }

  // Regex from TracksField.vue - supports :, -, • separators
  const trackPattern =
    /(?<position>\d+\s)?(?<artist>.+?)\s+[:\-•]\s+(?<title>.*?)(?=$|\s\((?<start_at>\d{2}:\d{2}:\d{2})\))/

  return tracksAsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, index) => {
      const match = line.match(trackPattern)
      if (!match || !match.groups) {
        // Fallback: ligne invalide, on la garde comme titre brut
        return {
          position: index + 1,
          artist: 'Unknown',
          title: line,
          start_at: null,
        }
      }

      const groups = match.groups as {
        position?: string
        artist?: string
        title?: string
        start_at?: string
      }

      return {
        position: groups.position ? parseInt(groups.position.trim(), 10) : index + 1,
        artist: groups.artist?.trim() || 'Unknown',
        title: groups.title?.trim() || 'Untitled',
        start_at: groups.start_at || null,
      }
    })
}

/**
 * Sérialise un array de Track[] en string tracksAsText
 * Format: "01 Artist : Title (00:05:12)"
 */
export function serializeTracks(tracks: Track[]): string {
  if (!tracks || tracks.length === 0) {
    return ''
  }

  return tracks
    .map((track, index) => {
      const position = String(track.position ?? index + 1).padStart(2, '0')
      const time = track.start_at ? ` (${track.start_at})` : ''
      return `${position} ${track.artist} : ${track.title}${time}`
    })
    .join('\n')
}
