export const isValidImageUrl = (url: string): boolean => {
  const regex = /https?:\/\/.*\.(png|gif|webp|jpeg|jpg|bmp|svg)/gi
  return regex.test(url)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFileStringFromBuffer = (file: any): Promise<{ data: string | null; filename: string | null }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!(e.target?.result instanceof ArrayBuffer)) {
        resolve({
          data: e.target?.result ?? null,
          filename: file.name ?? null,
        })
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.readAsDataURL(file)
    reader.onerror = reject
  })

// export const getDataFromUrl = async (url: string): Promise<string | null> => {
//   return await $fetch(`/api/base64Image?url=${url}`)
// }
