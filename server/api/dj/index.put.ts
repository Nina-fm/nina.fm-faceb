import DjFactory from '~/server/factory/dj'

export default defineEventHandler(async (event) => {
  const { id, ...data } = await readBody(event)
  const { updateById } = DjFactory

  const result = await updateById(id, data)

  return formattedResponse({
    ...result,
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
  })
})
