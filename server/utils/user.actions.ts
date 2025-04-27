import { User } from '@prisma/client'
import prisma from '~/lib/prisma'

export async function findUserByEmail(email: string): Promise<User> {
  if (!email) {
    throw createError({ message: 'Email is required!', statusCode: 400 })
  }
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user) {
    throw createError({
      message: 'User not found!',
      statusCode: 404,
    })
  }
  return user as User
}

export async function createUser(data: Partial<User>) {
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
}
