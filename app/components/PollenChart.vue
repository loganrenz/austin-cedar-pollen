<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

/**
 * PollenChart — 30-day pollen trend chart using grains/m³
 * Supports `embedded` mode for integration into the hero section.
 * Chart colors adapt to light/dark mode via CSS variables.
 */

const props = withDefaults(defineProps<{
  data: Array<{ date: string; count: number; level: string }>
  embedded?: boolean
}>(), {
  embedded: false,
})

const colorMode = useColorMode()

const activePeriod = ref(30)
const periods = [7, 14, 30]

function getSeverityColor(count: number): string {
  if (count < 50) return '#22C55E'
  if (count < 500) return '#EAB308'
  if (count < 1500) return '#F97316'
  if (count < 5000) return '#EF4444'
  return '#A855F7'
}

const filteredData = computed(() => {
  const slice = props.data.slice(-activePeriod.value)
  return slice
})

const isDark = computed(() => colorMode.value === 'dark')

const chartData = computed(() => {
  const labels = filteredData.value.map(d => {
    const parts = d.date.split('-')
    return `${parts[1]}/${parts[2]}`
  })
  const values = filteredData.value.map(d => d.count)
  const pointColors = values.map(v => getSeverityColor(v))

  return {
    labels,
    datasets: [{
      label: 'Pollen Count',
      data: values,
      borderColor: '#10B981',
      borderWidth: 2,
      pointRadius: activePeriod.value <= 14 ? 4 : 2,
      pointHoverRadius: 6,
      pointBackgroundColor: pointColors,
      pointBorderColor: 'transparent',
      fill: true,
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart
        const { ctx: canvasCtx, chartArea } = chart
        if (!chartArea) return 'rgba(16,185,129,0.1)'
        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(16,185,129,0.25)')
        gradient.addColorStop(0.5, 'rgba(16,185,129,0.08)')
        gradient.addColorStop(1, 'rgba(16,185,129,0)')
        return gradient
      },
      tension: 0.3,
    }]
  }
})

const chartOptions = computed(() => {
  const dark = isDark.value
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
        bodyColor: dark ? '#ffffff' : '#1a1a2e',
        borderColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        titleFont: { size: 11, weight: '400' as const },
        bodyFont: { size: 13, weight: '600' as const },
        callbacks: {
          label: (ctx: any) => {
            const val = ctx.raw
            let level = 'Low'
            if (val >= 5000) level = 'Severe'
            else if (val >= 1500) level = 'Very High'
            else if (val >= 500) level = 'High'
            else if (val >= 50) level = 'Medium'
            return `${val.toLocaleString()} grains/m³ — ${level}`
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)',
        },
        ticks: {
          color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)',
          font: { size: 10 },
          maxRotation: 0,
          maxTicksLimit: activePeriod.value <= 14 ? 14 : 10,
        },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 10000,
        grid: {
          color: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)',
        },
        ticks: {
          color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)',
          font: { size: 10 },
          stepSize: 2000,
          callback: (value: any) => {
            if (value >= 1000) return `${value / 1000}k`
            return value
          },
        },
        border: { display: false },
      },
    },
  }
})
</script>

<template>
  <div class="chart-container" :class="{ embedded }">
    <div class="chart-header">
      <h3 class="chart-title">Pollen Trend</h3>
      <div class="period-selector">
        <button
          v-for="p in periods"
          :key="p"
          class="period-btn"
          :class="{ active: activePeriod === p }"
          @click="activePeriod = p"
        >
          {{ p }}d
        </button>
      </div>
    </div>
    <div class="chart-wrapper" :class="{ 'chart-wrapper--embedded': embedded }">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
}

.chart-container.embedded {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.period-selector {
  display: flex;
  gap: 4px;
  background: var(--color-surface-hover);
  border-radius: 8px;
  padding: 3px;
}

.period-btn {
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn:hover {
  color: var(--color-text-secondary);
}

.period-btn.active {
  background: rgba(16,185,129,0.15);
  color: #10B981;
}

.chart-wrapper {
  height: 280px;
}

.chart-wrapper--embedded {
  height: 220px;
}
</style>
