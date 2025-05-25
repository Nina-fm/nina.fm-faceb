import TagFactory from '~/server/factory/tag'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  const { update } = TagFactory

  const result = await update(data)

  return formattedResponse(result)
})
