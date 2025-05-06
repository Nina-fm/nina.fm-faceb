import type { Mixtape } from '~/types/db'

export type MixtapeEdit = Omit<Mixtape, 'id' | 'createdAt' | 'updatedAt'>

export const useMixtapeApi = () => {
  const fetchMixtapes = async (params?: { page: number; limit: number }) => {
    const results = await $fetch('/api/mixtapes', {
      method: 'GET',
      params,
    })

    return results
  }

  const getMixtapeById = async (id: string) => {
    const result = await $fetch('/api/mixtape', {
      method: 'GET',
      params: { id },
    })
    if (!result) {
      return null
    }
    return result
  }

  const createMixtape = async (data: MixtapeEdit) => {
    const result = await $fetch('/api/mixtape', {
      method: 'POST',
      body: data,
    })
    if (!result) {
      return null
    }
    return result
  }

  const editMixtape = async (id: string, data: MixtapeEdit) => {
    const result = await $fetch('/api/mixtape', {
      method: 'PUT',
      body: { id, ...data },
    })
    if (!result) {
      return null
    }
    return result
  }

  const deleteMixtape = async (id: string | number) => {
    await $fetch('/api/mixtape', {
      method: 'DELETE',
      params: {
        id,
      },
    })
  }

  return {
    createMixtape,
    getMixtapeById,
    fetchMixtapes,
    editMixtape,
    deleteMixtape,
  }
}
