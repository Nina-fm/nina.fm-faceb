export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event)
  await session.clear()

  return {
    message: 'Successfully logged out!',
  }
})
