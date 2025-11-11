import { createClient } from "@supabase/supabase-js"

// Déclaration des constantes globales injectées par Vite
declare const __SUPABASE_URL__: string
declare const __SUPABASE_KEY__: string

export default defineNuxtPlugin(() => {
  // En mode SPA (ssr: false), les valeurs sont injectées au build-time via Vite define
  const supabaseUrl = __SUPABASE_URL__ || ""
  const supabaseKey = __SUPABASE_KEY__ || ""

  console.log("🔧 Supabase plugin init")
  console.log("URL:", supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "MISSING")
  console.log("KEY:", supabaseKey ? `${supabaseKey.substring(0, 30)}...` : "MISSING")

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase credentials missing!")
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase,
    },
  }
})
