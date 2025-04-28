import { getQuery } from 'h3'
import { getInvitations } from '~/server/utils/user.actions'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 100

  const invitations = await getInvitations(page, limit)

  return invitations
})
