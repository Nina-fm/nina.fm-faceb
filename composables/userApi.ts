import type { Prisma } from '@prisma/client'
import type { User } from '~/types/db'

type AvatarFile = Prisma.ImageCreateInput
type WithAvatarFile = { avatar?: AvatarFile & { file?: File } }

export type UserCreate = Prisma.UserCreateInput & WithAvatarFile
export type UserUpdate = Prisma.UserUpdateInput & WithAvatarFile

export const useUserApi = () => {
  const { deleteImage, getImagePublicUrl, uploadImage } = useImage()

  const _formatResult = (result: User) => {
    if (!result) return null
    const { avatar, ...rest } = result
    return {
      ...rest,
      avatar:
        avatar && avatar?.filename
          ? {
              ...avatar,
              url: getImagePublicUrl(avatar.filename, avatar.bucket || ''),
              alt: result?.name ?? '',
            }
          : undefined,
    }
  }

  const fetchUsers = async (params?: { page: number; limit: number }) => {
    const all = await $fetch('/api/users', {
      method: 'GET',
      params,
    })

    return {
      ...all,
      results: all.results.map(_formatResult),
    }
  }

  const getUserById = async (id: string) => {
    const result = await $fetch('/api/user', {
      method: 'GET',
      params: { id },
    })

    if (!result) {
      return null
    }

    return _formatResult(result)
  }

  const getUserImage = async (id: string) => {
    const result = await $fetch('/api/user', {
      method: 'GET',
      params: { id },
    })
    if (!result) {
      return null
    }
    return result.avatar
  }

  const updateUser = async (id: string, data: UserUpdate) => {
    let avatar: AvatarFile | undefined = undefined

    const currentImage = await getUserImage(id)
    if (currentImage?.id) {
      if (currentImage?.filename) {
        await deleteImage(currentImage.filename, currentImage.bucket)
      }
    }

    if (data?.avatar?.file) {
      const uploadedImage = await uploadImage(data.avatar.file, data.avatar?.bucket)
      if (uploadedImage?.filename) {
        avatar = {
          filename: uploadedImage.filename,
          bucket: data.avatar?.bucket,
        }
      }
    }

    const result = await $fetch('/api/user', {
      method: 'PUT',
      body: { id, ...data, avatar },
    })

    if (!result) {
      return null
    }

    return _formatResult(result)
  }

  const deleteUser = async (id: string) => {
    const currentImage = await getUserImage(id)
    if (currentImage?.id) {
      if (currentImage?.filename) {
        await deleteImage(currentImage.filename, currentImage.bucket)
      }
    }

    await $fetch('/api/user', {
      method: 'DELETE',
      params: {
        id,
      },
    })
  }

  return {
    getUserById,
    fetchUsers,
    updateUser,
    deleteUser,
  }
}
