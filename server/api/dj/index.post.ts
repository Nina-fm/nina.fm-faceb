import DjFactory from '~/server/factory/dj'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  const { create } = DjFactory

  const result = await create(data)

  return formattedResponse({
    ...result,
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
  })
})
