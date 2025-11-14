import tailwindcss from '@tailwindcss/vite'

const sitename = 'Face B • Nina.fm'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'nuxt-resend',
    '@pinia/nuxt',
    'shadcn-nuxt',
    'nuxt-seo-utils',
    '@vee-validate/nuxt',
    'nuxt-color-picker',
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
      extensions: ['.vue'],
      // Ignorer les fichiers qui ne sont pas des composants
      // ignore: ['**/index.ts'],
    },
  ],

  runtimeConfig: {
    debug: false,
    nina: {
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
      apiUrl: process.env.API_URL || 'http://localhost:4000',
      apiFileStoragePublicEndpoint: process.env.API_FILESTORAGE_PUBLIC_ENDPOINT || 'images',
      streamApiUrl: process.env.STREAM_API_URL,
      streamApiUrlFallback: process.env.STREAM_API_URL_FALLBACK,
      filestorageUrl: process.env.FILESTORAGE_URL,
      filestoragePublicEndpoint: process.env.FILESTORAGE_PUBLIC_ENDPOINT,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  devServer: {
    port: Number(process.env.FRONT_OUTPUT_PORT) || 3000,
  },

  // Proxy dev pour éviter CORS avec cookies
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        prependPath: true,
      },
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },

  // Disable SSR for auth-related pages to avoid flash
  routeRules: {
    '/': { ssr: false },
    '/login': { ssr: false },
    '/register': { ssr: false },
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
