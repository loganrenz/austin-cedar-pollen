import { getSeverityLevel, getSeverityColor, getSeverityDescription } from '../utils/pollen'
import { scrapeKxanPollen } from '../utils/kxan-scraper'

/**
 * GET /api/og
 *
 * Dynamic OpenGraph image endpoint.
 * Returns an SVG image with the current pollen count, severity level, and forecast.
 * Social platforms (Twitter/X, LinkedIn, Discord, Slack, iMessage) render this
 * as the preview image when the site is shared.
 *
 * Cached for 4 hours (pollen data updates once daily).
 */
export default defineCachedEventHandler(async (event) => {
  // Get current pollen data
  let count = 0
  let level: string = 'Low'
  let description = 'Minimal cedar pollen.'
  let color = '#22C55E'
  let forecast: Array<{ date: string; count: number }> = []

  try {
    const kxan = await scrapeKxanPollen()
    const cedarHistory = kxan.cedar
    const current = cedarHistory.length > 0 ? cedarHistory[cedarHistory.length - 1] : undefined
    count = current?.count ?? 0
    level = kxan.levels.cedar || getSeverityLevel(count)
    description = getSeverityDescription(getSeverityLevel(count))
    color = getSeverityColor(getSeverityLevel(count))

    // Build mini sparkline from recent history
    forecast = cedarHistory.slice(-7).map(e => ({ date: e.date, count: e.count }))
  } catch {
    // Fallback to defaults
  }

  // Format the count for display
  const countDisplay = count >= 1000
    ? `${(count / 1000).toFixed(1)}k`
    : count.toString()

  // Build sparkline path from forecast data
  const sparklinePath = buildSparkline(forecast, 340, 60)

  // Generate the SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1a"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.02"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle accent glow -->
  <circle cx="300" cy="315" r="280" fill="url(#accent)"/>

  <!-- Border accent line -->
  <rect x="0" y="0" width="1200" height="4" fill="${color}" opacity="0.6"/>

  <!-- Left section: Pollen data -->
  <!-- Live badge -->
  <circle cx="90" cy="70" r="5" fill="#22C55E"/>
  <text x="105" y="75" fill="#22C55E" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" letter-spacing="1.5">LIVE DATA</text>

  <!-- Main count -->
  <text x="80" y="260" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="120" font-weight="800" letter-spacing="-3">${countDisplay}</text>
  <text x="80" y="300" fill="rgba(255,255,255,0.5)" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" letter-spacing="2">GRAINS/M³</text>

  <!-- Severity badge -->
  <rect x="80" y="330" rx="20" ry="20" width="${level.length * 18 + 40}" height="40" fill="${color}" opacity="0.2"/>
  <rect x="80" y="330" rx="20" ry="20" width="${level.length * 18 + 40}" height="40" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
  <text x="${80 + (level.length * 18 + 40) / 2}" y="356" fill="${color}" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" text-anchor="middle" letter-spacing="1">${level.toUpperCase()}</text>

  <!-- Description -->
  <text x="80" y="410" fill="rgba(255,255,255,0.65)" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400">
    <tspan x="80" dy="0">${description.length > 60 ? description.substring(0, 57) + '...' : description}</tspan>
  </text>

  <!-- Right section: Sparkline chart -->
  <g transform="translate(700, 140)">
    <text x="0" y="0" fill="rgba(255,255,255,0.4)" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" letter-spacing="1.5">7-DAY TREND</text>
    ${sparklinePath ? `
    <g transform="translate(0, 20)">
      <path d="${sparklinePath.fillPath}" fill="url(#sparkFill)"/>
      <path d="${sparklinePath.linePath}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
      <!-- End dot -->
      <circle cx="${sparklinePath.lastX}" cy="${sparklinePath.lastY}" r="6" fill="${color}" filter="url(#glow)"/>
      <circle cx="${sparklinePath.lastX}" cy="${sparklinePath.lastY}" r="3" fill="white"/>
    </g>` : `
    <text x="170" y="50" fill="rgba(255,255,255,0.3)" font-family="system-ui, -apple-system, sans-serif" font-size="14" text-anchor="middle">No trend data</text>`}
  </g>

  <!-- Bottom: Site branding -->
  <text x="80" y="540" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700">Austin Cedar Pollen Tracker</text>
  <text x="80" y="570" fill="rgba(255,255,255,0.4)" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400">pollen.nardukapps.com · Live data from KXAN</text>

  <!-- Decorative grid dots -->
  ${generateGridDots()}
</svg>`

  setResponseHeader(event, 'Content-Type', 'image/svg+xml')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=14400, s-maxage=14400')
  return svg
}, {
  maxAge: 14400, // 4 hours
  name: 'og-image',
  getKey: () => 'og-pollen',
})

/**
 * Build SVG sparkline paths from data points
 */
function buildSparkline(data: Array<{ count: number }>, width: number, height: number) {
  if (data.length < 2) return null

  const maxCount = Math.max(...data.map(d => d.count), 1)
  const minCount = Math.min(...data.map(d => d.count))
  const range = maxCount - minCount || 1

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d.count - minCount) / range) * height,
  }))

  // Line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  // Fill path (closed shape for area under curve)
  const fillPath = `${linePath} L${width},${height} L0,${height} Z`

  const lastPoint = points[points.length - 1]
  return {
    linePath,
    fillPath,
    lastX: lastPoint ? lastPoint.x.toFixed(1) : '0',
    lastY: lastPoint ? lastPoint.y.toFixed(1) : '0',
  }
}

/**
 * Decorative subtle grid dots in the background
 */
function generateGridDots(): string {
  const dots: string[] = []
  for (let x = 700; x <= 1150; x += 50) {
    for (let y = 350; y <= 530; y += 50) {
      dots.push(`<circle cx="${x}" cy="${y}" r="1" fill="rgba(255,255,255,0.08)"/>`)
    }
  }
  return dots.join('\n  ')
}
