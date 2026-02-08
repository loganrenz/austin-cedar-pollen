import { generateMockWeatherData } from '../utils/pollen'

/**
 * GET /api/weather
 * Returns current weather conditions for Austin, TX.
 * Uses OpenWeather API when key is available, falls back to mock data.
 * Cached for 30 minutes.
 */
export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.openweatherApiKey

  if (apiKey) {
    try {
      const response = await $fetch<any>(
        `https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            q: 'Austin,TX,US',
            appid: apiKey,
            units: 'imperial'
          }
        }
      )

      if (response) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
        const windDeg = response.wind?.deg || 0
        const dirIndex = Math.round(windDeg / 45) % 8
        const mainCondition = response.weather?.[0]?.main || 'Clear'

        return {
          temp: Math.round(response.main?.temp || 55),
          feelsLike: Math.round(response.main?.feels_like || 52),
          humidity: response.main?.humidity || 50,
          windSpeed: Math.round(response.wind?.speed || 8),
          windDirection: directions[dirIndex],
          description: response.weather?.[0]?.description || 'Clear',
          condition: mapWeatherCondition(mainCondition),
        }
      }
    } catch (error) {
      console.warn('[weather] OpenWeather API failed, using mock data:', error)
    }
  }

  return generateMockWeatherData()
}, {
  maxAge: 1800,
  name: 'weather-data',
  getKey: () => 'austin-weather'
})

function mapWeatherCondition(main: string): string {
  const map: Record<string, string> = {
    'Clear': 'clear',
    'Clouds': 'cloudy',
    'Rain': 'rain',
    'Drizzle': 'rain',
    'Thunderstorm': 'storm',
    'Snow': 'cloudy',
    'Mist': 'fog',
    'Fog': 'fog',
    'Haze': 'fog',
  }
  return map[main] || 'partly-cloudy'
}
