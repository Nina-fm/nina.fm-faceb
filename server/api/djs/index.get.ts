import DjFactory from '~/server/factory/dj'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 100
  const { fetchAll } = DjFactory

  const all = await fetchAll(page, limit)

  return formattedResponse(all)
})
