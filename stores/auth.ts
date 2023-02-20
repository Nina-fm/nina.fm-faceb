import { AnyFn, Obj } from "~~/types/supatypes";

import { Provider } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const { $supabase } = useNuxtApp();
  const { snackError } = useSnackbarStore();
  const user = useSupabaseUser();
  const token = useSupabaseToken();
  const isLoading = ref<boolean>(false);
  const isLoggedIn = computed(() => !!user.value && !!token.value);

  watchEffect(() => {
    if (!isLoggedIn) {
      return navigateTo("/login");
    }
  });

  /**
   * Listen for login state changes
   */
  $supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
    token.value = session?.access_token || null;
    isLoading.value = false;
  });

  const errorHandler = async (fn: AnyFn) => {
    try {
      isLoading.value = true;
      const result = await fn();
      if (result.error) throw result.error;
      return result;
    } catch (error: any) {
      console.log(error);
      snackError(error.error_description || error.message);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Login with email and password
   */
  const login = async ({ email, password }: SignInParams) =>
    await errorHandler(
      async () =>
        await $supabase.auth.signInWithPassword({
          email,
          password,
        })
    );

  /**
   * Login with email (magic)
   */
  const loginWithEmail = async ({ email }: Pick<SignInParams, "email">) =>
    await errorHandler(
      async () => await $supabase.auth.signInWithOtp({ email })
    );

  /**
   * Login with google, github, etc
   */

  const loginWithSocialProvider = async (provider: Provider) =>
    await errorHandler(
      async () =>
        await $supabase.auth.signInWithOAuth({
          provider,
        })
    );

  /**
   * Logout
   */
  const logout = async () =>
    await errorHandler(async () => await $supabase.auth.signOut());

  /**
   * Register
   */
  const register = async ({ email, password, ...meta }: SignUpParams) =>
    await errorHandler(
      async () =>
        await $supabase.auth.signUp({
          email,
          password,
        })
    );

  /**
   * Update user email, password, or meta data
   */
  const update = async (userData: Obj) =>
    await errorHandler(async () => await $supabase.auth.updateUser(userData));

  /**
   * Send user an email to reset their password
   * (ie. support "Forgot Password?")
   */
  const sendPasswordRestEmail = async (email: string) =>
    await errorHandler(
      async () => await $supabase.auth.resetPasswordForEmail(email)
    );

  const resetPassword = async (accessToken: string, newPassword: string) =>
    await errorHandler(
      async () =>
        await $supabase.auth.admin.updateUserById(accessToken, {
          password: newPassword,
        })
    );

  return {
    user,
    token,
    isLoading,
    login,
    loginWithEmail,
    loginWithSocialProvider,
    isLoggedIn,
    logout,
    register,
    update,
    sendPasswordRestEmail,
    resetPassword,
  };
});

export const useAuthStoreRefs = () => storeToRefs(useAuthStore());

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
