import DjFactory from '~/server/factory/dj'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string
  const { deleteById } = DjFactory

  const result = await deleteById(id)

  return result
})
