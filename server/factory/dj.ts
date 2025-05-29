import { Prisma } from '@prisma/client'
import { kebabCase } from 'lodash-es'
import prisma from '~/lib/prisma'
import { parseDjs } from '~/server/utils/parseDjs'

interface MixtapesByDj {
  [slug: string]: {
    name: string
    mixtapes: Prisma.MixtapeGetPayload<{
      select: {
        id: true
        name: true
        djsAsText: true
        year: true
      }
    }>[]
  }
}

async function fetchAll(page: number, limit: number) {
  const mixtapes = await prisma.mixtape.findMany({
    select: {
      id: true,
      name: true,
      djsAsText: true,
      year: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const mixtapesByDj = mixtapes.reduce(
    (acc, mixtape) =>
      parseDjs(mixtape.djsAsText).reduce((acc2, dj) => {
        const slug = kebabCase(dj.name)
        return {
          ...acc2,
          [slug]: {
            name: acc2[slug]?.name ?? dj.name,
            mixtapes: [...(acc2[slug]?.mixtapes ?? []), mixtape],
          },
        }
      }, acc),
    {} as MixtapesByDj,
  )

  const djsArray = Object.entries(mixtapesByDj).map(([slug, { name, mixtapes }]) => {
    return {
      slug,
      name,
      mixtapesCount: mixtapes.length,
      since: mixtapes.length > 0 ? mixtapes[0].year : new Date().getFullYear(),
    }
  })

  const results = djsArray.slice((page - 1) * limit, page * limit)

  const total = djsArray.length

  return {
    results,
    total,
    page,
    limit,
  }
}

const DjFactory = {
  fetchAll,
}

export default DjFactory
