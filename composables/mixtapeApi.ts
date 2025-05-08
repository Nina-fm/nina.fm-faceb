import type { Prisma } from '@prisma/client'
import type { Mixtape } from '~/types/db'

type CoverFile = Prisma.ImageCreateInput
type WithCoverFile = { cover?: CoverFile & { file?: File } }

export type MixtapeCreate = Prisma.MixtapeCreateInput & WithCoverFile
export type MixtapeUpdate = Prisma.MixtapeUpdateInput & WithCoverFile

export const useMixtapeApi = () => {
  const { deleteImage, getImagePublicUrl, uploadImage } = useImage()

  const _formatResult = (result: Mixtape) => {
    if (!result) return null
    const { cover, ...rest } = result
    return {
      ...rest,
      cover:
        cover && cover?.filename
          ? {
              ...cover,
              url: getImagePublicUrl(cover.filename, cover.bucket || ''),
              alt: `${result.name}, mixtape Nina.fm par ${result.djsAsText}`,
            }
          : undefined,
    }
  }

  const fetchMixtapes = async (params?: { page: number; limit: number }) => {
    const all = await $fetch('/api/mixtapes', {
      method: 'GET',
      params,
    })

    return {
      ...all,
      results: all.results.map(_formatResult),
    }
  }

  const getMixtapeById = async (id: string) => {
    const result = await $fetch('/api/mixtape', {
      method: 'GET',
      params: { id },
    })

    if (!result) {
      return null
    }

    return _formatResult(result)
  }

  const getMixtapeImage = async (id: string) => {
    const result = await $fetch('/api/mixtape', {
      method: 'GET',
      params: { id },
    })
    if (!result) {
      return null
    }
    return result.cover
  }

  const createMixtape = async (data: MixtapeCreate) => {
    let cover: CoverFile | undefined = undefined

    if (data?.cover?.file) {
      const uploadedImage = await uploadImage(data.cover.file, data.cover?.bucket)
      if (uploadedImage?.filename) {
        cover = {
          filename: uploadedImage.filename,
          bucket: data.cover?.bucket,
        }
      }
    }

    const result = await $fetch('/api/mixtape', {
      method: 'POST',
      body: {
        ...data,
        cover,
      },
    })

    if (!result) {
      return null
    }

    return _formatResult(result)
  }

  const updateMixtape = async (id: string, data: MixtapeUpdate) => {
    let cover: CoverFile | undefined = undefined

    const currentImage = await getMixtapeImage(id)
    if (currentImage?.id) {
      if (currentImage?.filename) {
        await deleteImage(currentImage.filename, currentImage.bucket)
      }
    }

    if (data?.cover?.file) {
      const uploadedImage = await uploadImage(data.cover.file, data.cover?.bucket)
      if (uploadedImage?.filename) {
        cover = {
          filename: uploadedImage.filename,
          bucket: data.cover?.bucket,
        }
      }
    }

    const result = await $fetch('/api/mixtape', {
      method: 'PUT',
      body: { id, ...data, cover },
    })

    if (!result) {
      return null
    }

    return _formatResult(result)
  }

  const deleteMixtape = async (id: string) => {
    const currentImage = await getMixtapeImage(id)
    if (currentImage?.id) {
      if (currentImage?.filename) {
        await deleteImage(currentImage.filename, currentImage.bucket)
      }
    }

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
    updateMixtape,
    deleteMixtape,
  }
}
