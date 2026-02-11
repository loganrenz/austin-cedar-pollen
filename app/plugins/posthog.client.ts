import posthog from 'posthog-js'

export default defineNuxtPlugin({
  name: 'posthog',
  parallel: true,
  setup(nuxtApp) {
    const config = useRuntimeConfig()
    const key = config.public.posthogKey as string

    if (!key || typeof window === 'undefined') return

    const ph = posthog.init(key, {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // we handle manually for SPA
      capture_pageleave: true,
      loaded: (instance) => {
        if (import.meta.env.DEV) {
          instance.debug()
        }

        // Opt out on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          instance.opt_out_capturing()
          return
        }

        // Partition by app when using a single shared PostHog project (set APP_NAME in Doppler)
        const appName = config.public.appName as string
        if (appName) {
          instance.register({ app: appName })
        }

        // Tag internal traffic
        if (window.location.hostname.endsWith('.pages.dev')) {
          instance.register({ is_internal_user: true })
        }
      }
    })

    if (!ph) return

    // Capture pageviews on route change (SPA-friendly)
    const router = useRouter()
    router.afterEach((to) => {
      nextTick(() => {
        ph.capture('$pageview', {
          $current_url: window.location.origin + to.fullPath
        })
      })
    })

    return {
      provide: {
        posthog: ph
      }
    }
  }
})
