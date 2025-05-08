import UserFactory from '~/server/factory/user'

export default defineEventHandler(async (event) => {
  const { id, ...data } = await readBody(event)

  const result = await UserFactory.updateById(id, data)

  return formattedResponse({
    ...result,
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
    emailVerified: result.emailVerified ? new Date(result.emailVerified) : null,
    avatar: result.avatar
      ? {
          ...result.avatar,
          createdAt: new Date(result.avatar.createdAt),
          updatedAt: new Date(result.avatar.updatedAt),
        }
      : null,
  })
})
