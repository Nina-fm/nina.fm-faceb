import { Prisma } from '@prisma/client'
import prisma from '~/lib/prisma'
import { oneToOneCreate, oneToOneSync } from '~/server/utils/prismaOneToOne'

type WithAvatarFile = { avatar?: Prisma.ImageCreateInput & { file?: File } }
type EntityUpdate = Prisma.UserCreateManyInput & WithAvatarFile
type EntityCreate = Omit<EntityUpdate, 'id' | 'createdAt' | 'updatedAt'>

const table = prisma.user
const entityName = 'User'
const entityNamePlural = 'Users'

async function fetchAll(page: number, limit: number) {
  const results = await table.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      roles: true,
      createdAt: true,
      updatedAt: true,
      avatar: true,
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

async function getById(id: string) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const result = await table.findUnique({
    where: { id },
    include: {
      avatar: true,
    },
  })

  if (!result) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  return result
}

async function getByEmail(email: string) {
  if (!email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }

  const result = await table.findUnique({
    where: { email },
    include: {
      avatar: true,
    },
  })

  if (!result) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  return result
}

async function create({ avatar, ...data }: EntityCreate, invitationToken?: string) {
  if (!data.email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }

  if (!data.password) {
    throw createError({ message: 'Password is required!', statusCode: 400 })
  }

  const result = await table.create({
    data: {
      ...data,
      ...oneToOneCreate('avatar', avatar),
    },
    include: {
      avatar: true,
    },
  })

  if (!result) {
    throw createError({ message: `Failed to create ${entityName}!`, statusCode: 500 })
  }

  if (invitationToken) {
    const invitation = await prisma.invitation.findUnique({
      where: { token: invitationToken },
    })

    if (!invitation) {
      throw createError({ message: 'Invalid invitation token!', statusCode: 400 })
    }

    await prisma.invitation.delete({
      where: { id: invitation.id },
    })
  }

  return result
}

async function update({ id, avatar, ...data }: EntityUpdate) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }
  if (!data.email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }
  if (!data.roles) {
    throw createError({ message: 'At least one Role is required!', statusCode: 400 })
  }

  const exist = await table.findUnique({
    where: { id: id.toString() },
    include: {
      avatar: true,
    },
  })

  if (!exist) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  const result = await table.update({
    where: { id: exist.id },
    data: {
      ...data,
      ...oneToOneSync('avatar', avatar, exist?.avatar?.id),
      updatedAt: new Date(),
    },
    include: {
      avatar: true,
    },
  })

  if (!result) {
    throw createError({ message: `Failed to update ${entityName}!`, statusCode: 500 })
  }

  return result
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

const UserFactory = {
  create,
  deleteById,
  entityName,
  entityNamePlural,
  fetchAll,
  getById,
  getByEmail,
  table,
  update,
}

export default UserFactory
