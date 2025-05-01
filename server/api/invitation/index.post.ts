export default defineEventHandler(async (event) => {
  const session = await useAuthSession(event)
  const { email, baseUrl } = await readBody(event)

  const result = await inviteUser({ email, invitedById: session.data.id }, baseUrl)

  return result
})
