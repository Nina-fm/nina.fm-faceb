export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 100

  const result = await fetchUsers(page, limit)

  return formattedResponse({
    ...result,
    users: result.users.map((user) => ({
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
    })),
  })
})
