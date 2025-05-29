import type { Mixtape, Tag } from '~/types/db'

export const useMixtapesTags = () => {
  const parseMixtapesTags = (mixtapes: Mixtape[]) => {
    const tags = mixtapes.reduce((acc, mixtape) => {
      if (mixtape?.tags) {
        mixtape.tags.forEach((tag) => {
          if (!acc.some((t) => t.id === tag.id)) {
            acc.push(tag)
          }
        })
      }
      return acc
    }, [] as Tag[])

    return tags.sort((a, b) => a.name.localeCompare(b.name))
  }

  return { parseMixtapesTags }
}
