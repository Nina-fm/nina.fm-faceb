export const useLoadingStore = defineStore('loading', () => {
  const loadingPercent = ref<number | null>(null)
  const loadingPercentInc = ref<number | null>(null)
  const loadingPercentTotal = ref<number | null>(null)
  const loadingStack = ref<string[]>([])

  const loading = computed<boolean>(() => !!loadingStack.value.length)

  watch(loadingPercentInc, (value: number | null) => {
    if (typeof value === 'number' && typeof loadingPercentTotal.value === 'number') {
      loadingPercent.value = getPercent(value, loadingPercentTotal.value)
    }
  })

  const setLoadingPercent = (percent: number) => {
    loadingPercent.value = percent
  }

  const incrementLoadingPercent = () => {
    loadingPercentInc.value = (loadingPercentInc.value ?? 0) + 1
  }

  const loadingOn = (key: string, total?: number | null) => {
    loadingStack.value.push(key)

    if (typeof total === 'number') {
      loadingPercentTotal.value = total
      loadingPercentInc.value = 0
    }
  }

  const loadingOff = (key: string) => {
    loadingPercent.value = null
    loadingPercentInc.value = null
    loadingPercentTotal.value = null
    const index = loadingStack.value.findIndex((k) => k === key)
    if (index >= 0) {
      loadingStack.value.splice(index, 1)
    }
  }

  const isLoading = (key: string) => loadingStack.value.includes(key)

  return {
    loading,
    loadingPercent,
    isLoading,
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
