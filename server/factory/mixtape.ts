import { Prisma } from '@prisma/client'
import prisma from '~/lib/prisma'
import { manyToManySync } from '~/server/utils/prismaManyToMany'
import { oneToOneCreate, oneToOneSync } from '~/server/utils/prismaOneToOne'

type WithCoverFile = { cover?: Prisma.ImageCreateInput & { file?: File } }
type WithTags = { tags?: Prisma.TagUpdateManyMutationInput[] }
type EntityUpdate = Prisma.MixtapeCreateManyInput & WithCoverFile & WithTags
type EntityCreate = Omit<EntityUpdate, 'id' | 'createdAt' | 'updatedAt'>

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
      tags: true,
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
      tags: true,
    },
  })

  if (!result) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  return result
}

async function create({ cover, tags, ...data }: EntityCreate) {
  if (!data.name) {
    throw createError({ message: 'Name is required!', statusCode: 400 })
  }

  const result = await table.create({
    data: {
      ...data,
      ...oneToOneCreate('cover', cover),
      ...manyToManySync('tags', tags),
    },
    include: {
      cover: true,
      tags: true,
    },
  })

  if (!result) {
    throw createError({ message: `Failed to create ${entityName}!`, statusCode: 500 })
  }

  return result
}

async function update({ id, cover, tags, ...data }: EntityUpdate) {
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
      tags: true,
    },
  })

  if (!exist) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  const result = await table.update({
    where: { id: exist.id },
    data: {
      ...data,
      ...oneToOneSync('cover', cover, exist?.cover?.id),
      ...manyToManySync('tags', tags, exist?.tags),
      updatedAt: new Date(),
    },
    include: {
      cover: true,
      tags: true,
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
