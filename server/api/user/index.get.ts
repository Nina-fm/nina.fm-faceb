import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string
  const { entityName, getById } = UserFactory

  const result = await getById(id)

  if (!result) {
    throw createError({
      message: `${entityName} not found!`,
      statusCode: 404,
    })
  }

  return formattedResponse(result)
})
