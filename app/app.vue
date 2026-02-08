<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val: boolean) => { colorMode.preference = val ? 'dark' : 'light' }
})

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'About Cedar Fever', to: '/about' },
  { label: 'Allergy Tips', to: '/tips' },
]

const mobileMenuOpen = ref(false)

watch(route, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <UApp>
    <div class="app-shell">
      <!-- Header -->
      <header class="app-header">
        <div class="header-inner">
          <NuxtLink to="/" class="header-brand">
            <div class="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span class="brand-text">Cedar Tracker</span>
            <span class="brand-tag">ATX</span>
          </NuxtLink>

          <!-- Desktop nav -->
          <nav class="header-nav desktop-nav">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-link"
              :class="{ 'nav-link--active': route.path === item.to }"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="header-actions">
            <ClientOnly>
              <USwitch
                v-model="isDark"
                size="sm"
                unchecked-icon="i-lucide-sun"
                checked-icon="i-lucide-moon"
              />
              <template #fallback>
                <span class="theme-toggle-placeholder" />
              </template>
            </ClientOnly>

            <!-- Mobile hamburger -->
            <button
              class="mobile-toggle"
              @click="mobileMenuOpen = !mobileMenuOpen"
              aria-label="Toggle menu"
            >
              <svg v-if="!mobileMenuOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile nav -->
        <Transition name="slide-down">
          <nav v-if="mobileMenuOpen" class="mobile-nav">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link--active': route.path === item.to }"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </Transition>
      </header>

      <!-- Main -->
      <main class="app-main">
        <NuxtPage />
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-inner">
          <p class="footer-text">
            Data sourced from
            <a href="https://www.kxan.com/weather/allergy-forecast/" target="_blank" rel="noopener" class="footer-link">
              KXAN / Allergy &amp; Asthma Center of Georgetown
            </a>
          </p>
          <p class="footer-sub">
            Cedar Tracker ATX &middot; Austin, TX &middot; Not medical advice
          </p>
        </div>
      </footer>
    </div>
  </UApp>
</template>

<style>
/* ---- Light & Dark Theme Variables ---- */
:root {
  --color-primary: #10B981;
  --radius: 14px;

  /* Light mode defaults */
  --color-bg: #f8fafc;
  --color-bg-secondary: #ffffff;
  --color-surface: rgba(0,0,0,0.02);
  --color-surface-hover: rgba(0,0,0,0.04);
  --color-border: rgba(0,0,0,0.08);
  --color-border-hover: rgba(0,0,0,0.15);
  --color-text: #1a1a2e;
  --color-text-secondary: rgba(0,0,0,0.7);
  --color-text-muted: rgba(0,0,0,0.45);
  --color-text-faint: rgba(0,0,0,0.25);
  --color-header-bg: rgba(248,250,252,0.85);
  --color-chart-grid: rgba(0,0,0,0.06);
  --color-chart-text: rgba(0,0,0,0.4);
  --color-tooltip-bg: rgba(255,255,255,0.95);
  --color-tooltip-title: rgba(0,0,0,0.5);
  --color-tooltip-body: #1a1a2e;
  --color-tooltip-border: rgba(0,0,0,0.1);
  --color-ring-track: rgba(0,0,0,0.06);
  --color-ring-text: rgba(0,0,0,0.5);
  --color-scrollbar: rgba(0,0,0,0.12);
  --color-scrollbar-hover: rgba(0,0,0,0.2);
}

.dark {
  --color-bg: #0a0f1a;
  --color-bg-secondary: #0f1629;
  --color-surface: rgba(255,255,255,0.03);
  --color-surface-hover: rgba(255,255,255,0.06);
  --color-border: rgba(255,255,255,0.06);
  --color-border-hover: rgba(255,255,255,0.12);
  --color-text: rgba(255,255,255,0.85);
  --color-text-secondary: rgba(255,255,255,0.7);
  --color-text-muted: rgba(255,255,255,0.4);
  --color-text-faint: rgba(255,255,255,0.25);
  --color-header-bg: rgba(10, 15, 26, 0.85);
  --color-chart-grid: rgba(255,255,255,0.03);
  --color-chart-text: rgba(255,255,255,0.3);
  --color-tooltip-bg: rgba(15,23,42,0.95);
  --color-tooltip-title: rgba(255,255,255,0.6);
  --color-tooltip-body: #ffffff;
  --color-tooltip-border: rgba(255,255,255,0.1);
  --color-ring-track: rgba(255,255,255,0.06);
  --color-ring-text: rgba(255,255,255,0.4);
  --color-scrollbar: rgba(255,255,255,0.1);
  --color-scrollbar-hover: rgba(255,255,255,0.2);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s ease, color 0.3s ease;
}

/* Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 300px;
  opacity: 1;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-scrollbar); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-scrollbar-hover); }
</style>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--color-header-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: rgba(16, 185, 129, 0.12);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.brand-text {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.brand-tag {
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 7px;
  background: rgba(16, 185, 129, 0.12);
  color: var(--color-primary);
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Desktop nav */
.desktop-nav {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: 8px;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}

.nav-link--active {
  color: var(--color-primary);
  background: rgba(16, 185, 129, 0.08);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
}

/* Mobile nav */
.mobile-nav {
  padding: 8px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-nav-link {
  padding: 10px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link--active {
  color: var(--color-primary);
  background: rgba(16, 185, 129, 0.06);
}

/* Main */
.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Footer */
.app-footer {
  border-top: 1px solid var(--color-border);
  padding: 24px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.footer-link {
  color: var(--color-primary);
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-sub {
  font-size: 0.65rem;
  color: var(--color-text-faint);
  margin-top: 6px;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
  .app-main {
    padding: 20px 16px;
  }
}
</style>
