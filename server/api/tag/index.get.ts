import TagFactory from '~/server/factory/tag'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string
  const { entityName, getById } = TagFactory

  const result = await getById(id)

  if (!result) {
    throw createError({
      message: `${entityName} not found!`,
      statusCode: 404,
    })
  }

  return formattedResponse(result)
})
