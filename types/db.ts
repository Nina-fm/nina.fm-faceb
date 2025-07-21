import type { Prisma } from '@prisma/client'

export type Image = Prisma.ImageGetPayload<{}>

export type User = Prisma.UserGetPayload<{}> & {
  avatar?: Image & {
    url?: string
    alt?: string
  }
}

export type Mixtape = Prisma.MixtapeGetPayload<{
  include: {
    tags: true
  }
}> & {
  cover?: Image & {
    url?: string
    alt?: string
  }
}

export type Tag = Prisma.TagGetPayload<{}>

export interface Track {
  position: number
  title: string
  artist: string
  startAt: string
  [key: string]: any
}
