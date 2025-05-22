import type { Dj } from '~/types/db'

export type DjEdit = Omit<Dj, 'id' | 'createdAt' | 'updatedAt'>

export const useDjApi = () => {
  const { pending, defineAction, defineDelayedAction } = useAction()

  const fetchDjs = async (params?: { page: number; limit: number }) =>
    defineDelayedAction(async () => {
      const results = await $fetch('/api/djs', {
        method: 'GET',
        params,
      })

      return results
    })

  const getDjById = async (id: string) =>
    defineAction(async () => {
      const result = await $fetch('/api/dj', {
        method: 'GET',
        params: { id },
      })
      if (!result) {
        return null
      }
      return result
    })

  const createDj = async (data: DjEdit) =>
    defineDelayedAction(async () => {
      const result = await $fetch('/api/dj', {
        method: 'POST',
        body: data,
      })
      if (!result) {
        return null
      }
      return result
    })

  const updateDj = async (id: string, data: DjEdit) =>
    defineDelayedAction(async () => {
      const result = await $fetch('/api/dj', {
        method: 'PUT',
        body: { id, ...data },
      })
      if (!result) {
        return null
      }
      return result
    })

  const deleteDj = async (id: string | number) =>
    defineDelayedAction(async () => {
      await $fetch('/api/dj', {
        method: 'DELETE',
        params: {
          id,
        },
      })
    })

  return {
    // State
    pending,
    // Methods
    createDj,
    getDjById,
    fetchDjs,
    updateDj,
    deleteDj,
  }
}
