import { Mixtape } from '@prisma/client'
import prisma from '~/lib/prisma'

type Entity = Mixtape

type CreateData = Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>
type EditData = Omit<Entity, 'createdAt' | 'updatedAt'>

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
  })

  if (!result) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  return result as Entity
}

async function create(data: CreateData) {
  if (!data.name) {
    throw createError({ message: 'Name is required!', statusCode: 400 })
  }

  const result = await table.create({
    data,
  })

  if (!result) {
    throw createError({ message: `Failed to create ${entityName}!`, statusCode: 500 })
  }

  return result as Entity
}

async function updateById(id: string, data: EditData) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }
  if (!data.name) {
    throw createError({ message: 'Name is required!', statusCode: 400 })
  }

  const exist = await table.findUnique({
    where: { id },
  })

  if (!exist) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  const result = await table.update({
    where: { id: exist.id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })

  if (!result) {
    throw createError({ message: `Failed to update ${entityName}!`, statusCode: 500 })
  }

  return {
    ...result,
    createdAt: new Date(result.createdAt),
    updatedAt: new Date(result.updatedAt),
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

const MixtapeFactory = {
  create,
  deleteById,
  entityName,
  entityNamePlural,
  fetchAll,
  getById,
  table,
  updateById,
}

export default MixtapeFactory
