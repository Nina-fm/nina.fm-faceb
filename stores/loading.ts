import { defineStore, storeToRefs } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const loading = ref<boolean>(false);
  const loadingPercent = ref<number | null>(null);

  const { isLoading: authIsLoading } = storeToRefs(useAuthStore());
  const { isLoading: mixtapesIsLoading } = storeToRefs(useMixtapesStore());
  const { isLoading: authorsIsLoading } = storeToRefs(useAuthorsStore());

  const isLoading = computed<boolean>(
    () =>
      loading.value ||
      authIsLoading.value ||
      mixtapesIsLoading.value ||
      authorsIsLoading.value
  );

  const toggleLoading = () => {
    loading.value = !loading.value;
  };

  const setLoadingPercent = (percent: number) => {
    loadingPercent.value = percent;
  };

  const loadingOn = (percent?: number | null) => {
    if (typeof percent === "number") {
      loadingPercent.value = percent;
    }
    loading.value = true;
  };

  const loadingOff = () => {
    loadingPercent.value = null;
    loading.value = false;
  };

  return {
    loading,
    loadingPercent,
    isLoading,
    toggleLoading,
    loadingOff,
    loadingOn,
    setLoadingPercent,
  };
});
