import { kebabCase } from 'lodash-es'

export const parseDjs = (djsString: string): { name: string; slug: string }[] => {
  if (!djsString) return []

  return djsString
    .split(/[,&]/g)
    .map((dj) => dj.trim())
    .filter((dj) => dj !== '')
    .map((dj) => ({
      name: dj,
      slug: kebabCase(dj),
    }))
}
