/**
 * JSON-LD Structured Data — WebSite schema for search engine rich results
 */
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Austin Cedar Pollen Count — Live Tracker & Forecast',
          url: 'https://austin-cedar-pollen.pages.dev',
          description: 'Live Austin, TX cedar pollen count, 5-day forecast, and 30-day trends. Track mountain cedar allergy levels during cedar fever season (Dec–Feb). Free daily updates.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://austin-cedar-pollen.pages.dev/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })
      }
    ]
  })
})
