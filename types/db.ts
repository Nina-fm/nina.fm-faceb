import { Prisma } from '@prisma/client'

export type Image = Prisma.ImageGetPayload<{}>

export type User = Prisma.UserGetPayload<{}> & {
  avatar?: Image & {
    url?: string
    alt?: string
  }
}

export type Mixtape = Prisma.MixtapeGetPayload<{}> & {
  cover?: Image & {
    url?: string
    alt?: string
  }
}

export type Dj = Prisma.DjGetPayload<{}>
