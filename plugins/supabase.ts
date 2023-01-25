export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient();
  const auth = useSupabaseAuthClient();
  const user = useSupabaseUser();

  console.log({ supabase });
  console.log({ auth });
  console.log({ user: user.value });

  return {
    provide: {
      auth,
      supabase,
      user,
    },
  };
});
