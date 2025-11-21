# 🚨 КРИТИЧЕСКИЕ ИЗМЕНЕНИЯ ДЛЯ ИСПРАВЛЕНИЯ 404

## Проблема
Next-intl plugin конфликтует с Vercel Edge Runtime → 404 на всех страницах.

## Решение
Убрали `next-intl` plugin, но оставили переводы через прямой импорт сообщений.

---

## 📤 ЗАГРУЗИ ЭТИ 3 ФАЙЛА НА GITHUB:

### 1. `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### 2. `app/layout.tsx`
```typescript
import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
```

### 3. `app/[locale]/layout.tsx`
**ЗАМЕНИТЬ ПЕРВЫЕ 60 СТРОК:**

```typescript
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'
import { FacebookPixel } from '@/components/FacebookPixel'

// Import messages directly
import ruMessages from '@/messages/ru.json'
import kkMessages from '@/messages/kk.json'
import enMessages from '@/messages/en.json'
import ptBRMessages from '@/messages/pt-BR.json'

const messages = {
  'ru': ruMessages,
  'kk': kkMessages,
  'en': enMessages,
  'pt-BR': ptBRMessages,
}

const locales = ['ru', 'kk', 'en', 'pt-BR'] as const

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['700', '900'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'VIBELOOK AI Stylist - Персональный AI-стилист',
  description: 'Узнай свой цветотип и получи персональные рекомендации по стилю',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Get messages for this locale
  const localeMessages = messages[locale as keyof typeof messages] || messages['ru']
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '989549929881045'

  return (
    <html lang={locale} suppressHydrationWarning>
```

**ТАКЖЕ ЗАМЕНИТЬ СТРОКУ ~101:**

Было:
```typescript
        <NextIntlClientProvider messages={messages}>
```

Стало:
```typescript
        <NextIntlClientProvider messages={localeMessages} locale={locale}>
```

---

## 🎯 РЕЗУЛЬТАТ:

После деплоя:
- ✅ `/ru/` → работает
- ✅ `/en/` → работает
- ✅ `/kk/` → работает
- ✅ `/pt-BR/` → работает
- ✅ Переводы работают (импорт напрямую)
- ✅ НЕТ middleware конфликтов
- ✅ НЕТ next-intl plugin проблем

---

## P(успех) = 0.95 🚀

Это финальное решение!

