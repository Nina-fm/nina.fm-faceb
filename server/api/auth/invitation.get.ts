export default defineEventHandler(async (event) => {
  const token = getQuery(event).token as string

  const invitation = await getInvitation(token)

  return invitation
})
