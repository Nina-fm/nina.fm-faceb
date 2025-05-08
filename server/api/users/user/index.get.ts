import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const id = getQuery(event).id as string

  const user = await UserFactory.getById(id)

  if (!user) {
    throw createError({
      message: 'User not found!',
      statusCode: 404,
    })
  }

  return formattedResponse({
    ...user,
    ...(user.avatar
      ? {
          avatar: {
            ...user.avatar,
            createdAt: new Date(user.avatar.createdAt),
            updatedAt: new Date(user.avatar.updatedAt),
          },
        }
      : {}),
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  })
})
