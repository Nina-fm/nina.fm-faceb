import { Prisma } from '@prisma/client'
import { createError } from 'h3'
import prisma from '~/lib/prisma'

type EntityUpdate = Prisma.TagCreateManyInput
type EntityCreate = Omit<EntityUpdate, 'id' | 'createdAt' | 'updatedAt'>

const table = prisma.tag
const entityName = 'Tag'
const entityNamePlural = 'Tags'

async function fetchAll(page: number, limit: number) {
  const results = await table.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      mixtapes: true,
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
      mixtapes: true,
    },
  })

  if (!result) {
    throw createError({ message: `${entityName} not found!`, statusCode: 404 })
  }

  return result
}

async function create({ ...data }: EntityCreate) {
  if (!data.name) {
    throw createError({ message: 'Name is required!', statusCode: 400 })
  }

  const result = await table.create({
    data: {
      ...data,
    },
    include: {
      mixtapes: true,
    },
  })

  if (!result) {
    throw createError({ message: `Failed to create ${entityName}!`, statusCode: 500 })
  }

  return result
}

async function update({ id, ...data }: EntityUpdate) {
  if (!id) {
    throw createError({ message: 'Id is required!', statusCode: 400 })
  }
  if (!data.name) {
    throw createError({ message: 'Name is required!', statusCode: 400 })
  }

  const exist = await table.findUnique({
    where: { id: id.toString() },
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
    include: {
      mixtapes: true,
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
