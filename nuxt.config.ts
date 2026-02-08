// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  ui: {
    colorMode: true
  },

  colorMode: {
    preference: 'system'
  },

  runtimeConfig: {
    googlePollenApiKey: process.env.GOOGLE_POLLEN_API_KEY || '',
    openweatherApiKey: process.env.OPENWEATHER_API_KEY || '',
    public: {
      appUrl: process.env.SITE_URL || 'https://pollen.nardukapps.com',
      posthogKey: '',
      ga4Id: ''
    }
  },

  site: {
    url: 'https://pollen.nardukapps.com',
    name: 'Austin Cedar Pollen Count — Live Tracker & Forecast'
  },

  sitemap: {
    sources: ['/api/sitemap-urls']
  },

  nitro: {
    preset: 'cloudflare-pages',
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },

  app: {
    head: {
      title: 'Austin Cedar Pollen Count — Live Tracker & Forecast',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Live Austin, TX cedar pollen count, 5-day forecast, and 30-day trends. Track mountain cedar allergy levels during cedar fever season (Dec–Feb). Free daily updates.' },
        { name: 'keywords', content: 'austin pollen count today, cedar fever austin, mountain cedar allergy, austin allergy forecast, cedar pollen tracker' },
        { property: 'og:title', content: 'Austin Cedar Pollen Count — Live Tracker & Forecast' },
        { property: 'og:description', content: 'Live cedar pollen tracking for Austin, TX. Current levels, 5-day forecast, and seasonal trends.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://pollen.nardukapps.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Austin Cedar Pollen Count — Live Tracker & Forecast' },
        { name: 'twitter:description', content: 'Live cedar pollen tracking for Austin, TX. Current levels, 5-day forecast, and seasonal trends.' },
        { property: 'og:image', content: 'https://pollen.nardukapps.com/api/og' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:image', content: 'https://pollen.nardukapps.com/api/og' },
        { name: 'theme-color', content: '#1a1a2e' },
        { name: 'google-site-verification', content: '' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
