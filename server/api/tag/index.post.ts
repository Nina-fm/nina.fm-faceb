import TagFactory from '~/server/factory/tag'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  const { create } = TagFactory

  const result = await create(data)

  return formattedResponse(result)
})
