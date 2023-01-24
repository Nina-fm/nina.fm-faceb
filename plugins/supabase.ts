export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient();
  const auth = useSupabaseAuthClient();

  const user = useSupabaseUser();
  console.log({
    auth,
    supabase,
    user,
  });
  return {
    provide: {
      auth,
      supabase,
      user,
    },
  };
});
