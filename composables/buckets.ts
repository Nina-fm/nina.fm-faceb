export const useBuckets = () => {
  const { $supabase } = useNuxtApp()

  const upload = async (bucket: string, file: File) => {
    try {
      const { data, error } = await $supabase.storage.from(bucket).upload(`${file.name}`, file)

      if (error) throw error

      return data
    } catch (error) {
      throw error
    }
  }

  return {
    upload,
  }
}
