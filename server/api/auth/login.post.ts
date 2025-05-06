import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const session = await useAuthSession(event)
  const user = await UserFactory.getByEmail(email)

  if (!user) {
    throw createError({
      message: 'Email not found! Please register.',
      statusCode: 401,
    })
  }

  if (!user.password || user.password !== (await hash(password))) {
    throw createError({
      message: 'Incorrect password!',
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

  return formattedResponse(updatedSession)
})
