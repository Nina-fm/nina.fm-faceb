import type { Dj } from '~/types/db'

export type DjEdit = Omit<Dj, 'id' | 'createdAt' | 'updatedAt'>

export const useDjApi = () => {
  const fetchDjs = async (params?: { page: number; limit: number }) => {
    const results = await $fetch('/api/djs', {
      method: 'GET',
      params,
    })

    return results
  }

  const getDjById = async (id: string) => {
    const result = await $fetch('/api/dj', {
      method: 'GET',
      params: { id },
    })
    if (!result) {
      return null
    }
    return result
  }

  const createDj = async (data: DjEdit) => {
    const result = await $fetch('/api/dj', {
      method: 'POST',
      body: data,
    })
    if (!result) {
      return null
    }
    return result
  }

  const editDj = async (id: string, data: DjEdit) => {
    const result = await $fetch('/api/dj', {
      method: 'PUT',
      body: { id, ...data },
    })
    if (!result) {
      return null
    }
    return result
  }

  const deleteDj = async (id: string | number) => {
    await $fetch('/api/dj', {
      method: 'DELETE',
      params: {
        id,
      },
    })
  }

  return {
    createDj,
    getDjById,
    fetchDjs,
    editDj,
    deleteDj,
  }
}
