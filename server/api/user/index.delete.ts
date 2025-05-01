export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string

  const result = await deleteUser(id)

  return result
})
