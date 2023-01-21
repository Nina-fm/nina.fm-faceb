import { AuthError, PostgrestError } from "@supabase/supabase-js";

// API

declare global {
  type AuthReturn<T, U = "data"> = Promise<
    Rename<
      { data: U },
      {
        data: T | null;
        error: AuthError | null;
      }
    >
  >;

  type ApiReturn<T, U = "data"> = Promise<
    Rename<
      { data: U },
      {
        data: T | null;
        error: PostgrestError | null;
      }
    >
  >;

  interface SignUpParams {
    email: string;
    password: string;
  }

  interface SignInParams {
    email: string;
    password: string;
  }
}

export {};
