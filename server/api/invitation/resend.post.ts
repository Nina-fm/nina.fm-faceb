export default defineEventHandler(async (event) => {
  const { id, baseUrl } = await readBody(event)

  const result = await resendInvitation({ id }, baseUrl)

  return result
})
