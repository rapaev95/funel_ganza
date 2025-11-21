import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { cookies } from 'next/headers'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Проверяем сохраненный выбор языка из cookie
  try {
    const cookieStore = await cookies()
    const savedLocale = cookieStore.get('NEXT_LOCALE')?.value

    // Если есть сохраненный язык и он валидный, используем его
    if (savedLocale && routing.locales.includes(savedLocale as any)) {
      locale = savedLocale
    }
  } catch (error) {
    // Если не удалось получить cookie, используем дефолтный язык
    console.warn('Could not read cookies:', error)
  }

  // Ensure that a valid locale is used - всегда русский по умолчанию
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})

