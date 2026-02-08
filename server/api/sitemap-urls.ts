/**
 * Dynamic sitemap URLs for cedar pollen tracker
 */
export default defineEventHandler(() => {
  return [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/tips', changefreq: 'monthly', priority: 0.8 },
  ]
})
