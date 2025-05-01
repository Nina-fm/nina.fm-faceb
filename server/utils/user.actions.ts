import { User } from '@prisma/client'
import prisma from '~/lib/prisma'

type UserEdit = Omit<User, 'password' | 'createdAt' | 'updatedAt'>

export async function fetchUsers(page: number, limit: number) {
  const users = await prisma.user.findMany({
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

  const total = await prisma.user.count()

  return {
    users,
    total,
    page,
    limit,
  }
}

export async function getUserById(id: string) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      avatar: true,
    },
  })

  if (!user) {
    throw createError({ message: 'User not found!', statusCode: 404 })
  }

  return user
}

export async function findUserByEmail(email: string): Promise<User> {
  if (!email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      avatar: true,
    },
  })

  if (!user) {
    throw createError({ message: 'User not found!', statusCode: 404 })
  }

  return user as User
}

export async function createUser(data: Partial<User>, invitationToken?: string) {
  if (!data.email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }

  if (!data.password) {
    throw createError({ message: 'Password is required!', statusCode: 400 })
  }

  const user = await prisma.user.create({
    data: {
      email: data.email!,
      password: data.password!,
      name: data.name || '',
    },
  })

  if (!user) {
    throw createError({ message: 'Failed to create user!', statusCode: 500 })
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

  return user as User
}

export async function updateUser(id: string, data: UserEdit) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }
  if (!data.email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }
  if (!data.roles) {
    throw createError({ message: 'At least one Role is required!', statusCode: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw createError({ message: 'User not found!', statusCode: 404 })
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
    include: {
      avatar: true,
    },
  })

  if (!updatedUser) {
    throw createError({ message: 'Failed to update user!', statusCode: 500 })
  }

  return {
    ...updatedUser,
    emailVerified: updatedUser.emailVerified ? new Date(updatedUser.emailVerified) : null,
    createdAt: new Date(updatedUser.createdAt),
    updatedAt: new Date(updatedUser.updatedAt),
  }
}

export async function deleteUser(id: string | number) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: id.toString() },
  })

  if (!user) {
    throw createError({ message: 'User not found!', statusCode: 404 })
  }

  await prisma.user.delete({
    where: { id: user.id },
  })

  return {
    message: 'User successfully deleted!',
  }
}
