import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  // Import messages statically to avoid issues with Edge Runtime
  const messages = await (async () => {
    switch (locale) {
      case 'ru':
        return (await import('../messages/ru.json')).default
      case 'kk':
        return (await import('../messages/kk.json')).default
      case 'en':
        return (await import('../messages/en.json')).default
      case 'pt-BR':
        return (await import('../messages/pt-BR.json')).default
      default:
        return (await import('../messages/ru.json')).default
    }
  })()

  return {
    locale,
    messages
  }
})

