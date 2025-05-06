import { Prisma } from '@prisma/client'

export type User = Prisma.UserGetPayload<{
  select: {
    id: true
    name: true
    email: true
    roles: true
    avatar: true
    emailVerified: true
    createdAt: true
    updatedAt: true
  }
  include: { avatar: true }
}>

export type Image = Prisma.ImageGetPayload<{
  include: { user: true }
}>

export type Dj = Prisma.DjGetPayload<{}>

export type Mixtape = Prisma.MixtapeGetPayload<{
  include: { cover: true }
}>
