import UserFactory from '~/server/factory/user'

export default eventHandler(async (event) => {
  const refresh = getQuery(event).refresh as string
  const session = await useAuthSession(event)

  if (refresh && session.data?.email) {
    const user = await UserFactory.getByEmail(session.data.email)

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
      emailVerified: user?.emailVerified ? new Date(user.emailVerified) : null,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    })

    return formattedResponse(updatedSession.data)
  }

  return formattedResponse(session.data)
})
