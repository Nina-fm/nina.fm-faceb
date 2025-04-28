export default defineEventHandler(async (event) => {
  const { email, name, password, invitationToken } = await readBody(event)

  await createUser(
    {
      email,
      name: name ?? email.split('@')[0],
      password: await hash(password),
    },
    invitationToken,
  )

  return {
    message: 'Successfully registered!',
  }
})
