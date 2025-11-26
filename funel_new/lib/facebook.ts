'use client'

// Helper function to track custom events from client side
// Теперь принимает eventID для дедупликации Pixel + CAPI
export function trackFacebookEvent(
  eventName: string, 
  data?: Record<string, any>,
  eventID?: string
) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (eventID) {
      // Передаем eventID для дедупликации
      ;(window as any).fbq('track', eventName, data, { eventID })
    } else {
      ;(window as any).fbq('track', eventName, data)
    }
  }
}

