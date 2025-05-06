import InvitationFactory from '~/server/factory/invitation'

export default defineEventHandler(async (event) => {
  const { email, baseUrl } = await readBody(event)
  const session = await useAuthSession(event)

  const result = await InvitationFactory.create({ email, invitedById: session.data.id }, baseUrl)

  return result
})
