import { Invitation } from '@prisma/client'
import prisma from '~/lib/prisma'

type Entity = Invitation

const table = prisma.invitation
const entityName = 'Invitation'
const entityNamePlural = 'Invitations'

async function fetchAll(page: number, limit: number) {
  const results = await table.findMany({
    select: {
      id: true,
      email: true,
      token: true,
      invitedBy: true,
      createdAt: true,
      updatedAt: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  })

  const total = await table.count()

  return {
    results,
    total,
    page,
    limit,
  }
}

async function getByToken(token: string) {
  if (!token) {
    throw createError({ message: 'Token is required!', statusCode: 400 })
  }

  const result = await table.findUnique({
    where: { token },
  })

  if (!result) {
    throw createError({ message: `Invalid ${entityName} token!`, statusCode: 400 })
  }

  return result
}

async function create(data: { email: string; invitedById: string }, baseUrl: string) {
  if (!data.email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (user) {
    throw createError({ message: 'User already exists!', statusCode: 400 })
  }

  const result = await table.create({
    data: {
      email: data.email!,
      token: crypto.randomUUID(),
      invitedById: data.invitedById!,
    },
  })

  if (!result) {
    throw createError({ message: `Failed to create ${entityName}!`, statusCode: 500 })
  }

  try {
    const acceptUrl = `${baseUrl}/invitations/${result.token}/accept`
    await sendInvitationEmail(data.email!, acceptUrl)
  } catch (error) {
    throw createError({ message: `Failed to send ${entityName} email`, statusCode: 500 })
  }

  return {
    message: `${entityName} successfully resent!`,
  }
}

async function resend(data: { id: string | number }, baseUrl: string) {
  if (!data.id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const result = await table.findUnique({
    where: { id: data.id.toString() },
  })

  if (!result) {
    throw createError({ message: 'Invitation not found!', statusCode: 404 })
  }

  try {
    const acceptUrl = `${baseUrl}/invitations/${result.token}/accept`
    await sendInvitationEmail(result.email, acceptUrl)
  } catch (error) {
    throw createError({ message: `Failed to send ${entityName} email`, statusCode: 500 })
  }

  return {
    email: result.email,
    message: `${entityName} successfully resent!`,
  }
}

async function deleteById(id: string | number) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const result = await table.findUnique({
    where: { id: id.toString() },
  })

  if (!result) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  await table.delete({
    where: { id: result.id },
  })

  return {
    message: `${entityName} successfully deleted!`,
  }
}

const InvitationFactory = {
  create,
  deleteById,
  entityName,
  entityNamePlural,
  fetchAll,
  getByToken,
  resend,
  table,
}

export default InvitationFactory
