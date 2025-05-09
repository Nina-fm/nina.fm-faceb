import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string
  const { deleteById } = UserFactory

  const result = await deleteById(id)

  return result
})
