import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const data = await readBody(event)
  const { update } = UserFactory

  const result = await update(data)

  return formattedResponse(result)
})
