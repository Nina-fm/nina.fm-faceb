export default defineEventHandler(async (event) => {
  const { id, ...data } = await readBody(event)

  const user = await updateUser(id, data)

  return formattedResponse({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
    avatar: user.avatar
      ? {
          ...user.avatar,
          createdAt: new Date(user.avatar.createdAt),
          updatedAt: new Date(user.avatar.updatedAt),
        }
      : null,
  })
})
