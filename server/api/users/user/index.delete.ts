import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string

  const result = await UserFactory.deleteById(id)

  return result
})
