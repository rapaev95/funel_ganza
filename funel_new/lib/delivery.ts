/**
 * Логика определения региона и расчета доставки
 */

export type Currency = 'KZT' | 'RUB' | 'BYN' | 'AMD' | 'KGS' | 'UZS' | 'TJS' | 'USD'

export interface DeliveryInfo {
  region: string
  country: string
  currency: Currency
  deliveryDays: string
  isFree: boolean
  wbLink: string
}

/**
 * Маппинг стран к валютам
 */
const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  'KZ': 'KZT', // Казахстан
  'RU': 'RUB', // Россия
  'BY': 'BYN', // Беларусь
  'AM': 'AMD', // Армения
  'KG': 'KGS', // Кыргызстан
  'UZ': 'UZS', // Узбекистан
  'TJ': 'TJS', // Таджикистан
  'US': 'USD', // США (и другие страны по умолчанию)
}

/**
 * Маппинг стран к названиям
 */
const COUNTRY_NAMES: Record<string, string> = {
  'KZ': 'Казахстан',
  'RU': 'Россия',
  'BY': 'Беларусь',
  'AM': 'Армения',
  'KG': 'Кыргызстан',
  'UZ': 'Узбекистан',
  'TJ': 'Таджикистан',
  'US': 'США',
}

/**
 * Определение региона по IP через API
 */
export async function detectRegionByIP(): Promise<{ country: string; region?: string }> {
  try {
    // Используем бесплатный API для определения страны по IP
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    return {
      country: data.country_code || 'RU',
      region: data.region || data.city || undefined,
    }
  } catch (error) {
    console.error('Error detecting region by IP:', error)
    // Fallback на Россию
    return { country: 'RU', region: 'Москва' }
  }
}

/**
 * Определение региона через браузерный Geolocation API
 */
export async function detectRegionByGeolocation(): Promise<{ country: string; region?: string }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Если геолокация не поддерживается, используем IP
      detectRegionByIP().then(resolve)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Используем reverse geocoding для определения региона
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`
          )
          const data = await response.json()
          
          resolve({
            country: data.countryCode || 'RU',
            region: data.city || data.principalSubdivision || undefined,
          })
        } catch (error) {
          console.error('Error in reverse geocoding:', error)
          // Fallback на IP
          detectRegionByIP().then(resolve)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        // Fallback на IP
        detectRegionByIP().then(resolve)
      },
      { timeout: 5000 }
    )
  })
}

/**
 * Получить информацию о доставке
 */
export async function getDeliveryInfo(): Promise<DeliveryInfo> {
  // Сначала пробуем определить через IP (быстрее)
  const { country, region } = await detectRegionByIP()
  
  const currency = COUNTRY_TO_CURRENCY[country] || 'RUB'
  const countryName = COUNTRY_NAMES[country] || 'Россия'
  
  // Определяем сроки доставки
  let deliveryDays = '5-8 дней'
  if (country === 'RU') {
    deliveryDays = '5-8 дней'
  } else if (['KZ', 'BY', 'AM', 'KG', 'UZ', 'TJ'].includes(country)) {
    deliveryDays = '7-14 дней'
  } else {
    deliveryDays = '10-20 дней'
  }
  
  // Определяем ссылку на Wildberries
  const wbLink = country === 'RU' 
    ? 'https://www.wildberries.ru/seller/86144#'
    : 'https://global.wildberries.ru/seller/86144'
  
  return {
    region: region || countryName,
    country: countryName,
    currency,
    deliveryDays,
    isFree: true, // Доставка всегда бесплатна
    wbLink,
  }
}

/**
 * Конвертация цены в валюту
 */
export function convertPrice(priceRub: number, currency: Currency): number {
  // Курсы валют (можно обновлять через API)
  const exchangeRates: Record<Currency, number> = {
    RUB: 1,
    KZT: 5.5, // Примерный курс
    BYN: 0.035,
    AMD: 4.2,
    KGS: 0.95,
    UZS: 130,
    TJS: 0.12,
    USD: 0.011,
  }
  
  return Math.round(priceRub * exchangeRates[currency])
}

/**
 * Форматирование цены с валютой
 */
export function formatPrice(price: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    RUB: '₽',
    KZT: '₸',
    BYN: 'Br',
    AMD: '֏',
    KGS: 'с',
    UZS: 'so\'m',
    TJS: 'SM',
    USD: '$',
  }
  
  const symbol = symbols[currency]
  const formatted = new Intl.NumberFormat('ru-RU').format(price)
  
  return `${formatted} ${symbol}`
}


