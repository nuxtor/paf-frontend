// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/motion/nuxt',
  ],

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'en-GB' },
      title: 'Premium Abrahimic Foods | Quality Halal Meat & Food Delivery UK',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Premium halal meat and food delivered to your door. Quality certified halal beef, lamb, chicken & more. Serving UK households and wholesale buyers.',
        },
        { name: 'theme-color', content: '#1B4332' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Ovo&display=swap',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiSecret: '',
    stripeSecretKey: '',
    apiBackendUrl: process.env.NUXT_API_BACKEND_URL || 'http://paf-backend.test',
    public: {
      apiBaseUrl: process.env.NUXT_API_BACKEND_URL ? `${process.env.NUXT_API_BACKEND_URL}/api/v1` : 'https://api.premiumabrahamicfoods.co.uk/api/v1',
      imageBaseUrl: process.env.NUXT_API_BACKEND_URL ? `${process.env.NUXT_API_BACKEND_URL}/storage` : 'https://api.premiumabrahamicfoods.co.uk/storage',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'Premium Abrahimic Foods',
      stripePublishableKey: '',
      enableWholesale: true,
      enableReviews: true,
    },
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  vite: {
    server: {
      allowedHosts: ['premiumabrahamicfoods.co.uk', 'www.premiumabrahamicfoods.co.uk'],
    },
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  icon: {
    serverBundle: 'remote',
  },

  image: {
    quality: 80,
    format: ['webp', 'jpg'],
  },

  nitro: {
    output: {
      dir: 'static_output',
      publicDir: 'static_output/public',
    },
    prerender: {
      failOnError: false,
      crawlLinks: true,
      routes: [
        '/',
        '/wholesale',
        // Parent categories
        '/categories/meat',
        '/categories/poultry',
        '/categories/seafood',
        '/categories/groceries',
        // Meat subcategories
        '/categories/meat/beef',
        '/categories/meat/lamb',
        '/categories/meat/goat',
        '/categories/meat/mince',
        // Poultry subcategories
        '/categories/poultry/chicken',
        '/categories/poultry/turkey',
        '/categories/poultry/duck',
        // Seafood subcategories
        '/categories/seafood/fish',
        '/categories/seafood/prawns',
        '/categories/seafood/salmon',
        // Groceries subcategories
        '/categories/groceries/spices',
        '/categories/groceries/rice-grains',
        '/categories/groceries/oils',
        '/categories/groceries/sauces',
      ],
    },
  },
})