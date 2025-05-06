import MixtapeFactory from '~/server/factory/mixtape'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string
  const { deleteById } = MixtapeFactory

  const result = await deleteById(id)

  return result
})
