import ElementPlus from "unplugin-element-plus/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // head
    head: {
      htmlAttrs: {
        class: "dark",
      },
      title: "Nina.fm Admin",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "The Nina.fm Admin",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
      script: [],
    },
  },

  runtimeConfig: {
    public: {
      supabase: {
        functionsUrl: process.env.SUPABASE_FUNCTIONS_URL,
      },
    },
  },

  // ssr: false,

  css: ["~/assets/scss/index.scss"],

  // build
  build: {
    transpile: ["element-plus/es"],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  vite: {
    plugins: [ElementPlus()],
  },

  // build modules
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
    "@element-plus/nuxt",
    "@nuxtjs/supabase",
  ],

  imports: {
    dirs: ["stores"],
  },

  elementPlus: {
    themes: ["dark"],
  },

  // auto import components
  components: true,

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },
});
