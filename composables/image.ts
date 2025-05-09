type Bucket = string | null | undefined

export interface StorageFile {
  bucket: Bucket
  filename: string
  originalname: string
  publicUrl: string
}

export const useImage = () => {
  const { filestorageUrl } = useRuntimeConfig().public

  const getImagePublicUrl = (filename: string, bucket?: string) => {
    if (!filename) return ''
    return `${filestorageUrl}/public/${bucket ? `${bucket}/` : ''}${filename}`
  }

  const generateTmpImageUrl = (file: Blob) => {
    let src = URL.createObjectURL(file)
    setTimeout(() => {
      URL.revokeObjectURL(src)
    }, 1000)
    return src
  }

  const uploadImage = async (file: File, bucket: Bucket) => {
    if (!file) {
      throw createError({ message: 'File data are required to upload!', statusCode: 400 })
    }

    // IMPORTANT: Make sure to set the file input at latest position in formData
    const formData = new FormData()
    formData.append('bucket', bucket ?? '')
    formData.append('file', file)

    try {
      return await $fetch<StorageFile>(`${filestorageUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      })
    } catch (error) {
      console.error('Error uploading image file:', error)
      throw createError({ message: 'Failed to upload image file!', statusCode: 500 })
    }
  }

  const deleteImage = async (filename: string, bucket: Bucket) => {
    if (!filename) {
      throw createError({ message: 'Filename is required to delete!', statusCode: 400 })
    }

    try {
      return await $fetch(`${filestorageUrl}/api/delete`, {
        method: 'POST',
        body: { filename, bucket: bucket ?? '' },
      })
    } catch (error) {
      console.error('Error deleting image file:', error)
      // throw createError({ message: 'Failed to delete image file!', statusCode: 500 })
    }
  }

  return {
    deleteImage,
    filestorageUrl,
    generateTmpImageUrl,
    getImagePublicUrl,
    uploadImage,
  }
}
