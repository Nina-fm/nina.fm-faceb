import { defineStore, storeToRefs } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const loading = ref<boolean>(false);

  const { isLoading: authIsLoading } = storeToRefs(useAuthStore());
  const { isLoading: mixtapesIsLoading } = storeToRefs(useMixtapesStore());

  const isLoading = computed<boolean>(
    () => loading.value || authIsLoading.value || mixtapesIsLoading.value
  );

  const toggleLoading = () => {
    loading.value = !loading.value;
  };

  return {
    loading,
    isLoading,
    toggleLoading,
  };
});
