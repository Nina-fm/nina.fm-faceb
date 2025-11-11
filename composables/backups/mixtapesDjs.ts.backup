import { sortBy } from 'lodash-es'
import type { Mixtape } from '~/types/db'

export const useMixtapesDjs = () => {
  const parseMixtapesDjs = (mixtapes: Mixtape[]) => {
    const djs = sortBy(mixtapes, ['year', 'createdAt']).reduce(
      (acc, mixtape) => {
        if (mixtape?.djsAsText) {
          parseDjs(mixtape.djsAsText)?.forEach(({ name, slug }) => {
            if (!acc[slug]) {
              acc[slug] = name
            }
          })
        }
        return acc
      },
      {} as Record<string, string>,
    )

    return Object.values(djs).sort((a, b) => a.localeCompare(b))
  }

  return { parseMixtapesDjs }
}
