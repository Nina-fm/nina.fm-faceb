import { AnyFn } from "~~/types/supatypes"
import { log } from "~~/utils/console"

export const useProcess = ({ loadingKey, withLoading = true }: { withLoading?: boolean; loadingKey: string }) => {
  const { snackError, snackSuccess } = useSnackbarStore()
  const { loadingOn, loadingOff } = useLoadingStore()

  const process = async (fn: AnyFn, opts?: { successMsg?: string; withMessages?: boolean }) => {
    try {
      if (withLoading) {
        loadingOn(loadingKey)
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
      if (withLoading) {
        loadingOff(loadingKey)
      }
    }
  }

  return {
    process,
  }
}
