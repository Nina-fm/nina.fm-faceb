import TagFactory from '~/server/factory/tag'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string
  const { deleteById } = TagFactory

  const result = await deleteById(id)

  return result
})
