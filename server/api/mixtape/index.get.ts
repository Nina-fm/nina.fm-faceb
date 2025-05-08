import MixtapeFactory from '~/server/factory/mixtape'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string
  const { entityName, getById } = MixtapeFactory

  const result = await getById(id)

  if (!result) {
    throw createError({
      message: `${entityName} not found!`,
      statusCode: 404,
    })
  }

  return formattedResponse(result)
})
