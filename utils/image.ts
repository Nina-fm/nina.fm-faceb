export const getImagePublicUrl = (filename: string) => {
  if (!filename) return ''
  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${filename}`
}
