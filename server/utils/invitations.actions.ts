import prisma from '~/lib/prisma'

export async function inviteUser(data: { email: string; invitedById: string }, baseUrl: string) {
  if (!data.email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (user) {
    throw createError({ message: 'User already exists!', statusCode: 400 })
  }

  const invitation = await prisma.invitation.create({
    data: {
      email: data.email!,
      token: crypto.randomUUID(),
      invitedById: data.invitedById!,
    },
  })

  if (!invitation) {
    throw createError({ message: 'Failed to create invitation!', statusCode: 500 })
  }

  try {
    const acceptUrl = `${baseUrl}/invitations/${invitation.token}/accept`
    await sendInvitationEmail(data.email!, acceptUrl)
  } catch (error) {
    throw createError({ message: 'Failed to send invitation email', statusCode: 500 })
  }

  return {
    message: 'Invitation successfully resent!',
  }
}

export async function resendInvitation(data: { id: string | number }, baseUrl: string) {
  if (!data.id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: data.id.toString() },
  })

  if (!invitation) {
    throw createError({ message: 'Invitation not found!', statusCode: 404 })
  }

  try {
    const acceptUrl = `${baseUrl}/invitations/${invitation.token}/accept`
    await sendInvitationEmail(invitation.email, acceptUrl)
  } catch (error) {
    throw createError({ message: 'Failed to send invitation email', statusCode: 500 })
  }

  return {
    email: invitation.email,
    message: 'Invitation successfully resent!',
  }
}

export async function fetchInvitations(page: number, limit: number) {
  const invitations = await prisma.invitation.findMany({
    select: {
      id: true,
      email: true,
      token: true,
      invitedBy: true,
      createdAt: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  const total = await prisma.invitation.count()

  return {
    invitations,
    total,
    page,
    limit,
  }
}

export async function getInvitation(token: string) {
  if (!token) {
    throw createError({ message: 'Token is required!', statusCode: 400 })
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  })

  if (!invitation) {
    throw createError({ message: 'Invalid invitation token!', statusCode: 400 })
  }

  return invitation
}

export async function deleteInvitation(id: string | number) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: id.toString() },
  })

  if (!invitation) {
    throw createError({ message: 'Invitation not found!', statusCode: 404 })
  }

  await prisma.invitation.delete({
    where: { id: invitation.id },
  })

  return {
    message: 'Invitation successfully deleted!',
  }
}
