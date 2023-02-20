import vuetify from "vite-plugin-vuetify";

const sitename = "Face B • Nina.fm";

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
      siteurl: process.env.SITE_URL,
      streamApiUrl: process.env.STREAM_API_URL,
      streamApiUrlFallback: process.env.STREAM_API_URL_FALLBACK,
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
    resolve: {
      alias: {
        "vue-easy-lightbox":
          "vue-easy-lightbox/dist/external-css/vue-easy-lightbox.esm.min.js",
      },
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
  components: [
    {
      path: "~/components/",
      pathPrefix: false,
    },
  ],

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },
});
