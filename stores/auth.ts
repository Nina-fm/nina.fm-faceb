import type { Provider } from '@supabase/supabase-js'
import { defineStore, storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import type { AnyFn, Obj } from '~/types/supatypes'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const session = useSupabaseSession()
  const { loadingOn, loadingOff } = useLoadingStore()

  const token = computed(() => session.value?.access_token)
  const isLoggedIn = computed(() => !!user.value && !!token.value)

  // watch(isLoggedIn, (value) => {
  //   if (!value) {
  //     return navigateTo('/login')
  //   }
  // })

  const errorHandler = async (fn: AnyFn) => {
    try {
      loadingOn('auth')
      const result = await fn()
      if (result.error) throw result.error
      return result
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      log(error)
      toast.error(error.error_description || error.message)
    } finally {
      loadingOff('auth')
    }
  }

  /**
   * Login with email and password
   */
  const login = async ({ email, password }: SignInParams) =>
    await errorHandler(
      async () =>
        await supabase.auth.signInWithPassword({
          email,
          password,
        }),
    )

  /**
   * Login with email (magic)
   */
  const loginWithEmail = async ({ email }: Pick<SignInParams, 'email'>) =>
    await errorHandler(async () => await supabase.auth.signInWithOtp({ email }))

  /**
   * Login with google, github, etc
   */

  const loginWithSocialProvider = async (provider: Provider) =>
    await errorHandler(
      async () =>
        await supabase.auth.signInWithOAuth({
          provider,
        }),
    )

  /**
   * Logout
   */
  const logout = async () => await errorHandler(async () => await supabase.auth.signOut())

  /**
   * Register
   */
  const register = async ({ email, password, ...meta }: SignUpParams) =>
    await errorHandler(
      async () =>
        await supabase.auth.signUp({
          email,
          password,
        }),
    )

  /**
   * Update user email, password, or meta data
   */
  const update = async (userData: Obj) => await errorHandler(async () => await supabase.auth.updateUser(userData))

  /**
   * Send user an email to reset their password
   * (ie. support "Forgot Password?")
   */
  const sendPasswordRestEmail = async (email: string) =>
    await errorHandler(async () => await supabase.auth.resetPasswordForEmail(email))

  const resetPassword = async (accessToken: string, newPassword: string) =>
    await errorHandler(
      async () =>
        await supabase.auth.admin.updateUserById(accessToken, {
          password: newPassword,
        }),
    )

  return {
    user,
    token,
    login,
    loginWithEmail,
    loginWithSocialProvider,
    isLoggedIn,
    logout,
    register,
    update,
    sendPasswordRestEmail,
    resetPassword,
  }
})

export const useAuthStoreRefs = () => storeToRefs(useAuthStore())

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
