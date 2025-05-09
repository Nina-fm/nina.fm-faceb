import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 100
  const { fetchAll } = UserFactory

  const results = await fetchAll(page, limit)

  return formattedResponse(results)
})
