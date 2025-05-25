import prisma from '~/lib/prisma'

interface Dj {
  id: string
  name: string
  createdAt: Date
}

async function fetchAll(page: number, limit: number) {
  const mixtapes = await prisma.mixtape.findMany({
    select: {
      id: true,
      djsAsText: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const djsArray = mixtapes.reduce((acc, mixtape) => {
    const djs = mixtape.djsAsText
      .split(/[,&]/g)
      .map((dj) => dj.trim())
      .filter((dj) => dj !== '')
      .map((dj) => ({
        name: dj,
        createdAt: mixtape.createdAt,
      }))

    const djsToAdd = djs.filter((dj) =>
      acc.every((existingDj) => existingDj.name.toLowerCase() !== dj.name.toLowerCase()),
    )

    return [...acc, ...djsToAdd].map((dj, index) => ({
      id: (index + 1).toString(), // Using index as a temporary ID
      name: dj.name,
      createdAt: dj.createdAt,
    }))
  }, [] as Dj[])

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
