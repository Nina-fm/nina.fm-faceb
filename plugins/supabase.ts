import { User, createClient } from "@supabase/supabase-js";

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
