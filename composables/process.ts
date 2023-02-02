import { AnyFn } from "~~/types/supatypes";
import { Ref } from "nuxt/dist/app/compat/capi";

export const useProcess = ({ isLoading }: { isLoading?: Ref<boolean> }) => {
  const { snackError, snackSuccess } = useSnackbarStore();

  const process = async (fn: AnyFn, opts?: { successMsg?: string }) => {
    try {
      if (isLoading) {
        isLoading.value = true;
      }
      const result = await fn();
      if (opts?.successMsg) snackSuccess(opts.successMsg);
      return { data: result, error: null };
    } catch (error: any) {
      console.log(error);
      snackError(error?.data?.error ?? error?.message ?? error);
      return { data: null, error };
    } finally {
      if (isLoading) {
        isLoading.value = false;
      }
    }
  };

  return {
    process,
  };
};
