import { AnyFn } from "~~/types/supatypes"
import { Ref } from "nuxt/dist/app/compat/capi"
import { log } from "~~/utils/console"

export const useProcess = ({ isLoading }: { isLoading?: Ref<boolean> }) => {
  const { snackError, snackSuccess } = useSnackbarStore()
  const loading = ref<boolean>(isLoading?.value ?? false)

  watch(
    () => isLoading?.value,
    (value) => {
      loading.value = value ?? false
    }
  )

  const process = async (fn: AnyFn, opts?: { successMsg?: string; withMessages?: boolean }) => {
    try {
      if (loading) {
        loading.value = true
      }
      const result = await fn()
      if (opts?.successMsg && (opts?.withMessages ?? true)) snackSuccess(opts.successMsg)
      return { data: result, error: null }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log(error)
      if (opts?.withMessages ?? true) {
        snackError(error?.data?.error ?? error?.message ?? error)
      }
      return { data: null, error }
    } finally {
      if (loading) {
        loading.value = false
      }
    }
  }

  return {
    process,
  }
}
