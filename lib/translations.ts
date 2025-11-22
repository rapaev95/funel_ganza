// Простая система переводов без next-intl
// Использует только русские тексты из messages/ru.json

import ruMessages from '../messages/ru.json'

type Messages = typeof ruMessages

/**
 * Получает перевод по ключу (поддерживает вложенные ключи через точку)
 * Пример: t('landing.title') -> "Твой AI-стилист подберёт лук под твой цветотип."
 */
export function t(key: string): string {
  const keys = key.split('.')
  let value: any = ruMessages

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value]
    } else {
      // Если ключ не найден, возвращаем сам ключ
      console.warn(`Translation key not found: ${key}`)
      return key
    }
  }

  if (typeof value === 'string') {
    return value
  }

  // Если значение не строка, возвращаем ключ
  console.warn(`Translation value is not a string for key: ${key}`)
  return key
}

/**
 * Хук для использования в Client Components (совместим с useTranslations API)
 */
export function useTranslations(namespace?: string) {
  return (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return t(fullKey)
  }
}
