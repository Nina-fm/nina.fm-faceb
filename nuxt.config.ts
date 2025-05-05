import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

const sitename = 'Face B • Nina.fm'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    // '@nuxtjs/supabase',
    'nuxt-resend',
    '@pinia/nuxt',
    'shadcn-nuxt',
    'nuxt-seo-utils',
    '@prisma/nuxt',
    '@vee-validate/nuxt',
  ],

  css: ['~/assets/css/tailwind.css', '~/assets/css/main.css'],

  imports: {
    dirs: ['stores'],
  },

  // auto import components
  components: [
    {
      path: '~/components/',
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    debug: false,
    app: {
      auth: {
        name: 'nuxt-session',
        password: process.env.AUTH_SECRET,
        defaultProtected: true,
      },
      roles: {
        defaultRolesRequired: false,
      },
    },
    public: {
      sitename,
      siteurl: process.env.SITE_URL,
      streamApiUrl: process.env.STREAM_API_URL,
      streamApiUrlFallback: process.env.STREAM_API_URL_FALLBACK,
      supabaseFunctionsUrl: process.env.SUPABASE_FUNCTIONS_URL,
    },
  },

  prisma: {
    autoSetupPrisma: true,
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },

  nitro: {
    rollupConfig: {
      //@ts-ignore
      plugins: [vue()],
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  app: {
    // head
    head: {
      htmlAttrs: {
        class: 'dark',
      },
      title: sitename,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'The Nina.fm Admin',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
      script: [],
    },
  },
})
