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
    public: {
      sitename,
      // NUXT_PUBLIC_API_URL en prod, API_URL en dev
      apiUrl: process.env.NUXT_PUBLIC_API_URL || process.env.API_URL || '/api',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  devServer: {
    port: Number(process.env.FRONT_OUTPUT_PORT) || 3000,
  },

  // Proxy dev pour éviter CORS et simplifier les URLs
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.API_DEV_TARGET || 'http://localhost:4000',
        changeOrigin: true,
        // Retirer /api du path avant de proxy vers l'API
        rewrite: (path) => path.replace(/^\/api/, ''),
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
