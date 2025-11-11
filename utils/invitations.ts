export const getInvitationStatus = (
  usedAt: string | null,
  expiresAt: string | null,
): 'pending' | 'accepted' | 'expired' => {
  const now = new Date()

  if (usedAt) {
    return 'accepted'
  } else if (expiresAt && new Date(expiresAt) < now) {
    return 'expired'
  } else {
    return 'pending'
  }
}
