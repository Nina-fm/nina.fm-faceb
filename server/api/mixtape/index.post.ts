import MixtapeFactory from '~/server/factory/mixtape'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  const { create } = MixtapeFactory

  const result = await create(data)

  return formattedResponse({
    ...result,
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
  })
})
