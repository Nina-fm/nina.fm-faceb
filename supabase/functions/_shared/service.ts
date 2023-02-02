import { Database } from "../_types/supabase.ts";
import SupabaseClient from "https://esm.sh/v103/@supabase/supabase-js@2.4.0/dist/module/SupabaseClient";
import { createClient } from "https://esm.sh/v103/@supabase/supabase-js@2.4.0/dist/module/index";

export class Service {
  headers: Request["headers"];
  supabase: SupabaseClient;

  constructor(requestHeaders: Request["headers"]) {
    this.headers = requestHeaders;
    this.supabase = createClient<Database>(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: this.headers.get("Authorization")! },
        },
      }
    );
  }
}
