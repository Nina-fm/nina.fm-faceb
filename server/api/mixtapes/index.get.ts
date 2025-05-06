import MixtapeFactory from '~/server/factory/mixtape'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 100
  const { fetchAll } = MixtapeFactory

  const all = await fetchAll(page, limit)

  return formattedResponse({
    ...all,
    results: all.results.map((result) => ({
      ...result,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    })),
  })
})
