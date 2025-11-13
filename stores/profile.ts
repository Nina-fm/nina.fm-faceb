import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { acceptHMRUpdate } from 'pinia'
import type { Profile, Role } from '~/types/api/users.types'

// @deprecated - Ce store n'est plus utilisé. L'authentification est gérée par useAuthStore
export const useProfileStore = defineStore('profile', () => {
  // Note: Ce store est obsolète mais conservé pour compatibilité
  // @ts-ignore - Composables auto-imported may not be available
  const api = useApi()
  // @ts-ignore - useAuthStoreRefs may not exist
  const { isLoggedIn, user } = useAuthStoreRefs()
  // @ts-ignore - useProcess may not exist
  const { process } = useProcess({ loadingKey: 'profile' })
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

  // @ts-ignore - Profile type may not have role property
  const actAs = (role: Role) => !!data && data?.value?.role === role

  watch(isLoggedIn, (value: boolean) => {
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
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot))
}
