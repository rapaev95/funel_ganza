import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

// Import all messages at the top level (not dynamically)
import ruMessages from '../messages/ru.json'
import kzMessages from '../messages/kz.json'
import enMessages from '../messages/en.json'
import ptBRMessages from '../messages/pt-BR.json'

const messages = {
  'ru': ruMessages,
  'kz': kzMessages,
  'en': enMessages,
  'pt-BR': ptBRMessages,
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages] || messages['ru']
  }
})


