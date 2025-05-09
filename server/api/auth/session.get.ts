import UserFactory from '~/server/factory/user'

export default eventHandler(async (event) => {
  const refresh = getQuery(event).refresh as boolean
  const { getByEmail } = UserFactory

  const session = await useAuthSession(event)

  if (refresh && session.data?.email) {
    const user = await getByEmail(session.data.email)

    if (!user) {
      throw createError({
        message: 'Email not found! Please register.',
        statusCode: 401,
      })
    }

    const updatedSession = await session.update({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })

    return formattedResponse(updatedSession.data)
  }

  return formattedResponse(session.data)
})
