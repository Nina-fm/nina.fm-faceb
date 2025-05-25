import type { Prisma } from '@prisma/client'
import type { Tag } from '~/types/db'

export type TagCreate = Prisma.TagCreateInput
export type TagUpdate = Prisma.TagUpdateInput

export const useTagApi = () => {
  const { pending, defineAction, defineDelayedAction } = useAction()

  const _formatResult = (result: Tag) => {
    if (!result) return null
    const { ...rest } = result
    return {
      ...rest,
    }
  }

  const fetchTags = async (params?: { page: number; limit: number }) =>
    defineDelayedAction(async () => {
      const all = await $fetch('/api/tags', {
        method: 'GET',
        params,
      })

      return {
        ...all,
        results: all.results.map(_formatResult),
      }
    })

  const getTagById = async (id: string) =>
    defineAction(async () => {
      const result = await $fetch('/api/tag', {
        method: 'GET',
        params: { id },
      })

      if (!result) {
        return null
      }

      return _formatResult(result)
    })

  const createTag = async (data: TagCreate) =>
    defineDelayedAction(async () => {
      const result = await $fetch('/api/tag', {
        method: 'POST',
        body: {
          ...data,
        },
      })

      if (!result) {
        return null
      }

      return _formatResult(result)
    })

  const updateTag = async (id: string, data: TagUpdate) =>
    defineDelayedAction(async () => {
      const result = await $fetch('/api/tag', {
        method: 'PUT',
        body: { id, ...data },
      })

      if (!result) {
        return null
      }

      return _formatResult(result)
    })

  const deleteTag = async (id: string) =>
    defineDelayedAction(async () => {
      await $fetch('/api/tag', {
        method: 'DELETE',
        params: {
          id,
        },
      })
    })

  return {
    // State
    pending,
    // Actions
    fetchTags,
    getTagById,
    createTag,
    updateTag,
    deleteTag,
  }
}
