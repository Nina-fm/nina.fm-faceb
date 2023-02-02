export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient();

  return {
    provide: {
      supabase,
    },
  };
});
