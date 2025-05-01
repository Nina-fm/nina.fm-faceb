export default defineEventHandler(async (event) => {
  const token = getQuery(event).token as string

  const result = await getInvitation(token)

  return result
})
