import { UTMData } from '@/types/utm'

const UTM_STORAGE_KEY = 'utm_data'

/**
 * Извлекает UTM-параметры из URL
 * Собирает все параметры, начинающиеся с utm_ и fbclid
 */
export function extractUTMParams(searchParams?: string): UTMData {
  const params = new URLSearchParams(searchParams || (typeof window !== 'undefined' ? window.location.search : ''))
  const utmData: UTMData = {}

  // Собираем все utm_* параметры
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  utmKeys.forEach(key => {
    const value = params.get(key)
    if (value) {
      utmData[key as keyof UTMData] = value
    }
  })

  // Добавляем fbclid, если есть
  const fbclid = params.get('fbclid')
  if (fbclid) {
    utmData.fbclid = fbclid
  }

  return utmData
}

/**
 * Сохраняет UTM данные в localStorage
 */
export function saveUTMToStorage(utmData: UTMData): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData))
  } catch (error) {
    console.error('Error saving UTM to localStorage:', error)
  }
}

/**
 * Читает UTM данные из localStorage
 */
export function getUTMFromStorage(): UTMData | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as UTMData
  } catch (error) {
    console.error('Error reading UTM from localStorage:', error)
    return null
  }
}

/**
 * Получает UTM данные из Telegram WebApp startapp параметра
 */
export function getUTMFromTelegram(): UTMData | null {
  if (typeof window === 'undefined') return null

  try {
    const telegram = (window as any).Telegram
    if (!telegram?.WebApp) return null

    // Пробуем разные способы получить startapp параметр
    const startParam = 
      telegram.WebApp.initDataUnsafe?.start_param ||
      telegram.WebApp.startParam ||
      null

    if (!startParam) return null

    // Декодируем JSON строку
    const decoded = decodeURIComponent(startParam)
    const utmData = JSON.parse(decoded) as UTMData
    return utmData
  } catch (error) {
    console.error('Error getting UTM from Telegram:', error)
    return null
  }
}

/**
 * Основной метод для получения UTM в приложении
 * Сначала пытается получить из Telegram, потом из localStorage
 */
export function getUTMForApp(): UTMData {
  // Сначала пробуем получить из Telegram
  const telegramUTM = getUTMFromTelegram()
  if (telegramUTM && Object.keys(telegramUTM).length > 0) {
    return telegramUTM
  }

  // Если в Telegram нет, берем из localStorage
  const storedUTM = getUTMFromStorage()
  if (storedUTM && Object.keys(storedUTM).length > 0) {
    return storedUTM
  }

  // Если ничего нет, возвращаем пустой объект
  return {}
}

/**
 * Формирует ссылку на Telegram mini app с UTM в параметре startapp
 */
export function buildTelegramAppLink(utmData: UTMData, botUsername: string = 'vibelook_bot'): string {
  const utmJson = JSON.stringify(utmData)
  const encoded = encodeURIComponent(utmJson)
  return `https://t.me/${botUsername}/webapp?startapp=${encoded}`
}
