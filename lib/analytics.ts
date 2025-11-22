import { UTMData } from '@/types/utm'

interface AnalyticsEvent {
  event_name: string
  event_id?: string
  event_time?: string
  user_id?: string | number | null
  custom_data?: Record<string, any>
}

/**
 * Генерирует уникальный event_id для дедупликации Pixel + CAPI
 */
export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback для старых браузеров
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Отправляет событие аналитики на сервер (n8n webhook)
 * Используется для отправки событий в Facebook Conversion API через n8n
 */
export async function sendAnalyticsEvent(
  event: AnalyticsEvent,
  utmData?: UTMData
): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const eventData = {
      event_name: event.event_name,
      event_id: event.event_id, // Обязательное поле для дедупликации
      event_time: event.event_time || new Date().toISOString(),
      user_id: event.user_id || null,
      // UTM данные
      utm_source: utmData?.utm_source || null,
      utm_medium: utmData?.utm_medium || null,
      utm_campaign: utmData?.utm_campaign || null,
      utm_content: utmData?.utm_content || null,
      utm_term: utmData?.utm_term || null,
      fbclid: utmData?.fbclid || null,
      // Дополнительные данные из custom_data (раскладываются в корень)
      ...event.custom_data,
    }

    // Отправляем на серверный endpoint
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
  } catch (error) {
    // Не логируем ошибку, чтобы не засорять консоль
    // Аналитика не должна ломать основной flow
    console.error('Error sending analytics event:', error)
  }
}
