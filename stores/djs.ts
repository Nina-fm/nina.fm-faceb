import { defineStore } from 'pinia'

export interface Dj {
  id: string
  name: string
  createdAt: Date
}

export const useDjsStore = defineStore('djs', () => {
  const data = ref<Dj[]>([])
  const loading = ref(false)

  const fetch = async () => {
    loading.value = true

    const results = await useFetch('/api/djs', {
      method: 'GET',
    })

    if (results.data.value) {
      data.value = results.data.value.results || []
    } else {
      console.error('Failed to fetch DJs:', results.error.value)
    }

    loading.value = false
  }

  if (data.value.length === 0) {
    fetch()
  }

  return {
    data,
    loading,
    fetch,
  }
})

export const useDjsStoreRefs = () => storeToRefs(useDjsStore())

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDjsStore, import.meta.hot))
}
