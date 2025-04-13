import type { Profile } from '~/types/supatypes'

export const useUserProfile = (userId: string | null) => {
  const profile = ref<Profile>()

  const supabase = useSupabaseClient()

  const fetchProfile = async () => {
    if (!userId) {
      console.error('User ID is null or undefined')
      return
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single<Profile>()
    if (error) {
      console.error('Error fetching email:', error)
      return null
    }

    if (!data) {
      console.error('No data found for the given user ID')
      return null
    }

    profile.value = data
  }

  onMounted(() => {
    fetchProfile()
  })

  return profile
}
