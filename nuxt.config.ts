// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false, // Deshabilitamos SSR para un proyecto SPA
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  nitro: {
    experimental: {
      websocket: true // Habilitamos WebSocket solo si es necesario
    },
  },
  vite: {
    server: {
      hmr: process.env.NODE_ENV !== 'production' ? { // HMR solo en desarrollo
        protocol: 'wss',
        port: 3000,
      } : false,
    },
  },
  modules: [
    'nuxt-vuefire', 
    "@nuxtjs/tailwindcss", 
    "@nuxt/icon", 
    "@pinia/nuxt"
  ],
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false,
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "last" }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: false,
  },
  icon: {
    serverBundle: {
      collections: ["uil"], // Personaliza según tus necesidades
    },
  },
  sourcemap: {
    server: false, // Deshabilitado en producción para mayor seguridad
    client: false,
  },
  components: {
    global: true,
    dirs: ['~/components']
  },
});
