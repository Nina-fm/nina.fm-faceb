export default defineEventHandler(async (event) => {
  const session = await useAuthSession(event)
  const { email, baseUrl } = await readBody(event)

  await inviteUser({ email, invitedById: session.data.id }, baseUrl)

  return {
    message: 'Invitation successfully sent!',
  }
})
