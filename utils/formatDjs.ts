/**
 * Format a list of DJ names with proper separators
 * Examples:
 * - ["120"] → "120"
 * - ["120", "Fuji"] → "120 & Fuji"
 * - ["Hagi", "Siam", "Chapelier"] → "Hagi, Siam & Chapelier"
 */
export const formatDjs = (djs: { name: string }[] | undefined): string => {
  if (!djs || djs.length === 0) return '-'

  const names = djs.map((dj) => dj.name)

  if (names.length === 1) {
    return names[0] || '-'
  }

  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`
  }

  // 3 or more: "DJ1, DJ2, DJ3 & DJ4"
  const allButLast = names.slice(0, -1).join(', ')
  const last = names[names.length - 1]
  return `${allButLast} & ${last}`
}
