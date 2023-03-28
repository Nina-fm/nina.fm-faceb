import { defineStore, storeToRefs } from "pinia"

export const useLoadingStore = defineStore("loading", () => {
  const loading = ref<boolean>(false)
  const loadingPercent = ref<number | null>(null)
  const loadingPercentInc = ref<number | null>(null)
  const loadingPercentTotal = ref<number | null>(null)

  const { isLoading: authIsLoading } = storeToRefs(useAuthStore())
  const { isLoading: mixtapesIsLoading } = storeToRefs(useMixtapesStore())
  const { isLoading: authorsIsLoading } = storeToRefs(useAuthorsStore())

  const isLoading = computed<boolean>(
    () => loading.value || authIsLoading.value || mixtapesIsLoading.value || authorsIsLoading.value
  )

  watch(loadingPercentInc, (value: number | null) => {
    if (typeof value === "number" && typeof loadingPercentTotal.value === "number") {
      loadingPercent.value = getPercent(value, loadingPercentTotal.value)
    }
  })

  const toggleLoading = () => {
    loading.value = !loading.value
  }

  const setLoadingPercent = (percent: number) => {
    loadingPercent.value = percent
  }

  const incrementLoadingPercent = () => {
    loadingPercentInc.value = (loadingPercentInc.value ?? 0) + 1
  }

  const loadingOn = (total?: number | null) => {
    if (typeof total === "number") {
      loadingPercentTotal.value = total
      loadingPercentInc.value = 0
    }
    loading.value = true
  }

  const loadingOff = () => {
    loadingPercent.value = null
    loadingPercentInc.value = null
    loadingPercentTotal.value = null
    loading.value = false
  }

  return {
    loading,
    loadingPercent,
    isLoading,
    toggleLoading,
    loadingOff,
    loadingOn,
    setLoadingPercent,
    incrementLoadingPercent,
  }
})

export const useLoadingStoreRefs = () => storeToRefs(useLoadingStore())

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoadingStore, import.meta.hot))
}
