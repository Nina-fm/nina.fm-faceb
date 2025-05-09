import { Prisma } from '@prisma/client'
import prisma from '~/lib/prisma'

type WithCoverFile = { cover?: Prisma.ImageCreateInput & { file?: File } }

type EntityCreate = Prisma.MixtapeCreateInput & WithCoverFile
type EntityUpdate = Prisma.MixtapeUpdateInput & WithCoverFile

const table = prisma.mixtape
const entityName = 'Mixtape'
const entityNamePlural = 'Mixtapes'

async function fetchAll(page: number, limit: number) {
  const results = await table.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      year: true,
      cover: true,
      comment: true,
      djsAsText: true,
      tracksAsText: true,
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

async function getById(id: string) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }

  const result = await table.findUnique({
    where: { id },
    include: {
      cover: true,
    },
  })

  if (!result) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  return result
}

async function create({ cover, ...data }: EntityCreate) {
  if (!data.name) {
    throw createError({ message: 'Name is required!', statusCode: 400 })
  }

  const result = await table.create({
    data: {
      ...data,
      cover: cover ? { create: { ...cover } } : undefined,
    },
    include: {
      cover: true,
    },
  })

  if (!result) {
    throw createError({ message: `Failed to create ${entityName}!`, statusCode: 500 })
  }

  return result
}

async function update({ id, cover, ...data }: EntityUpdate) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }
  if (!data.name) {
    throw createError({ message: 'Name is required!', statusCode: 400 })
  }

  const exist = await table.findUnique({
    where: { id: id.toString() },
    include: {
      cover: true,
    },
  })

  if (!exist) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  const result = await table.update({
    where: { id: exist.id },
    data: {
      ...data,
      cover: cover
        ? {
            upsert: {
              where: { id: exist.cover?.id },
              create: { ...cover },
              update: { ...cover },
            },
          }
        : exist?.cover?.id && !cover
          ? {
              delete: { id: exist.cover.id },
            }
          : undefined,
      updatedAt: new Date(),
    },
    include: {
      cover: true,
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

const MixtapeFactory = {
  create,
  deleteById,
  entityName,
  entityNamePlural,
  fetchAll,
  getById,
  table,
  update,
}

export default MixtapeFactory
