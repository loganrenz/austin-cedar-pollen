<script setup lang="ts">
const { data: pollen, status: pollenStatus } = await useFetch('/api/pollen')
const { data: weather } = await useFetch('/api/weather')

const colorMode = useColorMode()
const hydrated = ref(false)

onMounted(() => {
  hydrated.value = true
})

const severityGradient = computed(() => {
  if (!pollen.value || !hydrated.value) return 'none'
  const level = pollen.value.current.level
  const isDark = colorMode.value === 'dark'
  const alpha = isDark ? 0.08 : 0.06
  const base = isDark ? 'rgba(10,15,26,0.95)' : 'rgba(248,250,252,0.95)'
  const gradients: Record<string, string> = {
    'Low': `linear-gradient(135deg, rgba(34,197,94,${alpha}), ${base})`,
    'Medium': `linear-gradient(135deg, rgba(234,179,8,${alpha}), ${base})`,
    'High': `linear-gradient(135deg, rgba(249,115,22,${alpha}), ${base})`,
    'Very High': `linear-gradient(135deg, rgba(239,68,68,${alpha}), ${base})`,
    'Severe': `linear-gradient(135deg, rgba(168,85,247,${alpha}), ${base})`,
  }
  return gradients[level] || gradients['Low']
})

const lastUpdatedFormatted = computed(() => {
  if (!pollen.value?.lastUpdated) return ''
  const d = new Date(pollen.value.lastUpdated)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
})

const sourceInfo = computed(() => {
  return (pollen.value as any)?.source || null
})
</script>

<template>
  <div>
    <!-- Combined Hero + Chart -->
    <section class="hero" :style="hydrated ? { background: severityGradient } : undefined">
      <div class="hero-top">
        <div class="hero-live">
          <span class="live-dot" />
          <span class="live-text">Live Data</span>
        </div>
        <ClientOnly>
          <span v-if="lastUpdatedFormatted" class="meta-item">Updated {{ lastUpdatedFormatted }}</span>
        </ClientOnly>
      </div>

      <div v-if="pollen" class="hero-body">
        <!-- Left: Ring + Description -->
        <div class="hero-left">
          <SeverityRing :count="pollen.current.count" :size="200" />
          <p class="hero-description">{{ pollen.current.description }}</p>
        </div>

        <!-- Right: Chart integrated inline -->
        <div class="hero-chart">
          <PollenChart v-if="pollen.history?.length" :data="pollen.history" :embedded="true" />
        </div>
      </div>
      <div v-else class="hero-loading">
        <p>Loading pollen data...</p>
      </div>
    </section>

    <!-- Weather + Stats -->
    <section v-if="pollen" class="stats-grid">
      <StatCard
        label="Current Temperature"
        :value="weather?.temp || 0"
        suffix="°F"
        color="#60A5FA"
      />
      <StatCard
        label="Season Peak"
        :value="pollen.season.peakCount"
        suffix="gr/m³"
        color="#F97316"
      />
      <StatCard
        label="30-Day Average"
        :value="pollen.season.avgCount"
        suffix="gr/m³"
        color="#10B981"
      />
      <StatCard
        label="High Days This Season"
        :value="pollen.season.highDays"
        suffix="days"
        color="#EF4444"
      />
    </section>

    <!-- Allergen Breakdown -->
    <section v-if="pollen" class="allergen-section">
      <h2 class="section-title">Allergen Breakdown</h2>
      <p class="section-subtitle">Current grains/m³ by type</p>
      <div class="allergen-grid">
        <div class="allergen-card">
          <div class="allergen-bar" style="background: #EF4444" />
          <div class="allergen-name">Cedar</div>
          <div class="allergen-count" style="color: #EF4444">{{ pollen.allergens.cedar.toLocaleString() }}</div>
          <div class="allergen-unit">grains/m³</div>
        </div>
        <div class="allergen-card">
          <div class="allergen-bar" style="background: #60A5FA" />
          <div class="allergen-name">Elm</div>
          <div class="allergen-count" style="color: #60A5FA">{{ ((pollen as any).elmHistory?.[(pollen as any).elmHistory?.length - 1]?.count || 0).toLocaleString() }}</div>
          <div class="allergen-unit">grains/m³</div>
        </div>
        <div class="allergen-card">
          <div class="allergen-bar" style="background: #A855F7" />
          <div class="allergen-name">Mold</div>
          <div class="allergen-count" style="color: #A855F7">{{ pollen.allergens.mold.toLocaleString() }}</div>
          <div class="allergen-unit">grains/m³</div>
        </div>
      </div>
    </section>

    <!-- 5-Day Forecast -->
    <section v-if="pollen?.forecast?.length" class="forecast-section">
      <h2 class="section-title">5-Day Forecast</h2>
      <p class="section-subtitle">Projected pollen levels based on recent trends</p>
      <div class="forecast-grid">
        <ForecastCard
          v-for="day in pollen.forecast"
          :key="day.date"
          :day-name="day.dayName"
          :date="day.date"
          :level="day.level"
          :count="day.count"
          :high-temp="day.highTemp"
          :low-temp="day.lowTemp"
          :condition="day.condition"
          :humidity="day.humidity"
          :wind-speed="day.windSpeed"
        />
      </div>
    </section>

    <!-- Quick Tips -->
    <section class="tips-section">
      <h2 class="section-title">Quick Protection Tips</h2>
      <div class="tips-grid">
        <div class="tip-card">
          <div class="tip-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h3 class="tip-title">Stay Indoors</h3>
          <p class="tip-text">Keep windows and doors closed during high pollen days. Run HEPA air purifiers.</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h3 class="tip-title">Nasal Rinse</h3>
          <p class="tip-text">Use saline nasal rinse after outdoor exposure to flush out pollen particles.</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 class="tip-title">Medication</h3>
          <p class="tip-text">Start antihistamines before symptoms peak. Consult your allergist for best options.</p>
        </div>
        <div class="tip-card">
          <div class="tip-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 class="tip-title">Change Clothes</h3>
          <p class="tip-text">Shower and change clothes after outdoor activity. Pollen clings to fabric and hair.</p>
        </div>
      </div>
    </section>

    <!-- Data source attribution — near the bottom -->
    <ClientOnly>
      <div v-if="sourceInfo" class="data-source">
        Data from {{ sourceInfo.name }} &middot; Report date: {{ sourceInfo.reportDate }}
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* Hero */
.hero {
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.hero-live {
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #22C55E;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(34,197,94,0); }
}

.live-text {
  font-size: 0.7rem;
  font-weight: 600;
  color: #22C55E;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.meta-item {
  font-size: 0.65rem;
  color: var(--color-text-muted);
}

/* Hero body — ring left, chart right */
.hero-body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: center;
  min-height: 260px;
}

.hero-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: 220px;
}

.hero-description {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 240px;
}

.hero-chart {
  min-width: 0;
  flex: 1;
}

.hero-loading {
  text-align: center;
  padding: 60px 0;
  color: var(--color-text-muted);
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

/* Allergen section */
.allergen-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.allergen-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.allergen-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 18px 16px;
}

.allergen-bar {
  width: 4px;
  height: 16px;
  border-radius: 2px;
  margin-bottom: 10px;
  opacity: 0.7;
}

.allergen-name {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.allergen-count {
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.allergen-unit {
  font-size: 0.6rem;
  color: var(--color-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Forecast */
.forecast-section {
  margin-bottom: 24px;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

/* Tips */
.tips-section {
  margin-bottom: 24px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.tip-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px 16px;
  transition: border-color 0.2s ease;
}

.tip-card:hover {
  border-color: var(--color-border-hover);
}

.tip-icon-wrap {
  width: 36px;
  height: 36px;
  background: rgba(16,185,129,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.tip-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-text);
}

.tip-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* Source attribution — subtle at bottom */
.data-source {
  text-align: center;
  font-size: 0.65rem;
  color: var(--color-text-faint);
  padding: 8px 0 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-body {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .hero-left {
    min-width: unset;
  }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .forecast-grid { grid-template-columns: repeat(3, 1fr); }
  .tips-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .hero { padding: 24px 16px; border-radius: 16px; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .allergen-grid { grid-template-columns: 1fr; }
  .forecast-grid { grid-template-columns: 1fr 1fr; }
  .tips-grid { grid-template-columns: 1fr; }
}
</style>
