import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  ui: {
    colorMode: true
  },

  // Inject build-time constants available in client & server code
  vite: {
    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __APP_VERSION__: JSON.stringify(pkg.version)
    }
  },

  runtimeConfig: {
    // Server-only keys (override via env vars)
    appleTeamId: process.env.APPLE_TEAM_ID || '',
    appleClientId: process.env.APPLE_CLIENT_ID || '',
    appleKeyId: process.env.APPLE_KEY_ID || '',
    appleSecretKey: process.env.APPLE_SECRET_KEY || '',

    public: {
      // Override via NUXT_PUBLIC_MAPKIT_TOKEN env var
      mapkitToken: 'eyJraWQiOiI4N1ZLTUI0QlAzIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJGVlNZN0NGQzNTIiwiaWF0IjoxNzcwNDg1MjYwLCJvcmlnaW4iOiIqLnBhZ2VzLmRldiJ9.Jq4v0eJUZJaSQccmZLZpt0m_OYGCn3q27s4Grl0gIZ97hD7ozKx1bGGuFwTD_mvfn7Bd_VMhSWHIGoSmOfxewA',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
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
      script: [
        // Apple MapKit JS — loaded globally, initialized in components via mapkit.init()
        {
          src: 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js',
          crossorigin: 'anonymous',
          async: true
        }
      ]
    }
  }
})
