import { Prisma } from '@prisma/client'

export type User = Prisma.UserGetPayload<{
  include: { avatar: true }
}>

export type Image = Prisma.ImageGetPayload<{
  include: { user: true }
}>
