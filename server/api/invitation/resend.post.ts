import InvitationFactory from '~/server/factory/invitation'

export default defineEventHandler(async (event) => {
  const { id, baseUrl } = await readBody(event)

  const result = await InvitationFactory.resend({ id }, baseUrl)

  return result
})
