import { Profile } from "~/types/supatypes"
import { Role } from "~~/supabase/functions/_types/database"

export const useProfileStore = defineStore("profile", () => {
  const api = useApi()
  const { isLoggedIn, user } = useAuthStoreRefs()
  const { process } = useProcess({ loadingKey: "profile" })
  const data = ref<Profile | null>(null)

  const loadProfile = async (userId: string) =>
    await process(async () => {
      const result = await api.get(`/profile`, {
        query: {
          id: userId,
        },
      })
      data.value = result as Profile
    })

  const load = () => {
    if (user.value?.id) {
      loadProfile(user.value?.id)
    }
  }

  const actAs = (role: Role) => !!data && data?.value?.role === role

  watch(isLoggedIn, (value) => {
    if (value) {
      load()
    }
  })

  load()

  return {
    profile: data,
    load,
    actAs,
  }
})

export const useProfileStoreRefs = () => storeToRefs(useProfileStore())

if (import.meta.hot) {
  // @ts-expect-error it's ok
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot))
}
