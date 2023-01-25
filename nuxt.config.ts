import ElementPlus from "unplugin-element-plus/vite";
import path from "node:path";

const sitename = "Nina.fm • Face B";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // head
    head: {
      htmlAttrs: {
        class: "dark",
      },
      title: sitename,
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
      sitename,
      supabase: {
        functionsUrl: process.env.SUPABASE_FUNCTIONS_URL,
      },
    },
  },

  ssr: false,

  // build
  build: {
    transpile: ["element-plus/es"],
  },

  typescript: {
    strict: true,
    shim: false,
  },

  vite: {
    resolve: {
      alias: {
        "~/": `${path.resolve(__dirname, ".")}/`,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/element/index.scss" as *; @use "~/styles/index.scss" as *;`,
        },
      },
    },
    plugins: [
      ElementPlus({
        useSource: true,
        defaultLocale: "fr",
      }),
    ],
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
