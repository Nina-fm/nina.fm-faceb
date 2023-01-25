import { Provider, User } from "@supabase/supabase-js";

import { ElMessage } from "element-plus";

export const useAuthStore = defineStore("auth", () => {
  const { $auth } = useNuxtApp();
  const isLoading = ref<boolean>(false);
  const user = useState<User | null>("supabase_user");
  const isLoggedIn = computed(() => !!user.value);

  const refresh = () => {
    const token = useSupabaseToken();
    if (!token.value) {
      user.value = null;
    }
  };

  refresh();

  /**
   * Listen for login state changes
   */
  $auth.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
    refresh();
    isLoading.value = false;
  });

  const errorHandler = async (fn: AnyFn) => {
    try {
      isLoading.value = true;
      return await fn();
    } catch (error: any) {
      console.log(error);
      ElMessage.error({ message: error.error_description || error.message });
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Login with email and password
   */
  const login = async ({ email, password }: SignInParams) =>
    await errorHandler(async () => {
      const { data: user, error } = await $auth.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return user;
    });

  /**
   * Login with email (magic)
   */
  const loginWithEmail = async ({ email }: Pick<SignInParams, "email">) =>
    await errorHandler(async () => {
      const { data: user, error } = await $auth.auth.signInWithOtp({ email });
      if (error) throw error;
      return user;
    });

  /**
   * Login with google, github, etc
   */

  const loginWithSocialProvider = async (provider: Provider) =>
    await errorHandler(async () => {
      const { data: user, error } = await $auth.auth.signInWithOAuth({
        provider,
      });
      if (error) throw error;
      return user;
    });

  /**
   * Logout
   */
  const logout = async () =>
    await errorHandler(async () => {
      const { error } = await $auth.auth.signOut();
      if (error) throw error;
    });

  /**
   * Register
   */
  const register = async ({ email, password, ...meta }: SignUpParams) =>
    await errorHandler(async () => {
      const { data: user, error } = await $auth.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return user;
    });

  /**
   * Update user email, password, or meta data
   */
  const update = async (data: Obj) =>
    await errorHandler(async () => {
      const { data: user, error } = await $auth.auth.updateUser(data);
      if (error) throw error;
      return user;
    });

  /**
   * Send user an email to reset their password
   * (ie. support "Forgot Password?")
   */
  const sendPasswordRestEmail = async (email: string) =>
    await errorHandler(async () => {
      const { data, error } = await $auth.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return data;
    });

  const resetPassword = async (accessToken: string, newPassword: string) =>
    await errorHandler(async () => {
      const { data: user, error } = await $auth.auth.admin.updateUserById(
        accessToken,
        {
          password: newPassword,
        }
      );
      if (error) throw error;
      return user;
    });

  return {
    user,
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
