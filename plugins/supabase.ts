import { createClient } from "@supabase/supabase-js"

// Déclaration des constantes globales injectées par Vite
declare const __SUPABASE_URL__: string
declare const __SUPABASE_KEY__: string

export default defineNuxtPlugin(() => {
  // En mode SPA (ssr: false), les valeurs sont injectées au build-time via Vite define
  const supabaseUrl = __SUPABASE_URL__ || ""
  const supabaseKey = __SUPABASE_KEY__ || ""

  const supabase = createClient(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase,
    },
  }
})
