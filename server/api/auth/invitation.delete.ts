export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string

  const invitation = await deleteInvitation(id)
})
