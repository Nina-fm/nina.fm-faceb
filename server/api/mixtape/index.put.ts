import MixtapeFactory from '~/server/factory/mixtape'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  const { update } = MixtapeFactory

  const result = await update(data)

  return formattedResponse(result)
})
