import InvitationFactory from '~/server/factory/invitation'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token as string

  const result = await InvitationFactory.getByToken(token)

  return result
})
