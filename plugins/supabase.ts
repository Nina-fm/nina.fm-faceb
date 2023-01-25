export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient();
  const auth = useSupabaseAuthClient();
  const user = useSupabaseUser();

  return {
    provide: {
      auth,
      supabase,
      user,
    },
  };
});
