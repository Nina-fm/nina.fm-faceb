import InvitationFactory from '~/server/factory/invitation'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 100

  const response = await InvitationFactory.fetchAll(page, limit)

  return formattedResponse({
    ...response,
    results: response.results.map((result) => ({
      ...result,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    })),
  })
})
