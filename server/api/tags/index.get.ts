import TagFactory from '~/server/factory/tag'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 100
  const { fetchAll } = TagFactory

  const results = await fetchAll(page, limit)

  return formattedResponse(results)
})
