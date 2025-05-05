import type { H3Event, SessionConfig } from 'h3'

const sessionConfig: SessionConfig = {
  ...useRuntimeConfig().app.auth,
}

export const useAuthSession = async (event: H3Event) => {
  const session = await useSession(event, sessionConfig)
  const user = await findUserByEmail(session.data.email)

  await session.update({
    roles: user.roles,
  })

  return session
}

export const requireAuthSession = async (event: H3Event) => {
  const session = await useAuthSession(event)
  if (!session.data.email) {
    throw createError({
      message: 'Not Authorized',
      statusCode: 401,
    })
  }
  return session
}

export async function hash(str: string) {
  const msgUint8 = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
