import vuetify from "vite-plugin-vuetify";

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

  typescript: {
    strict: true,
    shim: false,
  },

  css: [
    "assets/scss/variables.scss",
    "@mdi/font/css/materialdesignicons.min.css",
    "assets/scss/index.scss",
  ],

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"], // add the vuetify vite plugin
    },
    define: {
      "process.env.DEBUG": false,
    },
  },

  // build modules
  modules: [
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs", "acceptHMRUpdate"],
      },
    ],
    "@nuxtjs/supabase",
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        // @ts-ignore
        config.plugins.push(vuetify())
      );
    },
  ],

  imports: {
    dirs: ["stores"],
  },

  // auto import components
  components: true,

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },
});
