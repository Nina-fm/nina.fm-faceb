import { resendInvitation } from '~/server/utils/user.actions'

export default defineEventHandler(async (event) => {
  const { id, baseUrl } = await readBody(event)

  const response = await resendInvitation({ id }, baseUrl)

  return response
})
