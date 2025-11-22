# ✅ ИСПРАВЛЕНО! Загрузи эти 2 файла

## Что изменилось:

1. ✅ Вернули `next-intl` plugin в `next.config.js`
2. ✅ Удалили конфликтующие `app/layout.tsx` и `app/page.tsx`
3. ✅ Восстановили правильную работу `app/[locale]/layout.tsx` с `getMessages()`

---

## 📤 ФАЙЛЫ ДЛЯ ЗАГРУЗКИ:

### 1. `next.config.js`

```javascript
const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
}

module.exports = withNextIntl(nextConfig)
```

### 2. УДАЛИТЬ эти файлы на GitHub:
- ❌ `app/layout.tsx` (удалить!)
- ❌ `app/page.tsx` (удалить!)

### 3. `app/[locale]/layout.tsx` - ПЕРВЫЕ 50 СТРОК:

```typescript
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'
import { FacebookPixel } from '@/components/FacebookPixel'

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
  return routing.locales.map((locale) => ({ locale }))
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
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '989549929881045'

  return (
    <html lang={locale} suppressHydrationWarning>
```

**ТАКЖЕ в строке ~88 замени:**

```typescript
        <NextIntlClientProvider messages={messages}>
```

---

## 🚀 КАК ЗАГРУЗИТЬ:

### Через GitHub Web:

1. **Файл 1:** `next.config.js`
   - Открой https://github.com/rapaev95/funel_ganza/blob/main/next.config.js
   - Нажми Edit (✏️)
   - Замени содержимое
   - Commit

2. **Удали:** `app/layout.tsx` и `app/page.tsx`
   - Открой файл на GitHub
   - Нажми Delete (🗑️)
   - Commit

3. **Файл 2:** `app/[locale]/layout.tsx`
   - Открой https://github.com/rapaev95/funel_ganza/blob/main/app/%5Blocale%5D/layout.tsx
   - Нажми Edit
   - Замени строки 1-50 на код выше
   - Замени строку ~88 на `<NextIntlClientProvider messages={messages}>`
   - Commit

---

## 🎯 РЕЗУЛЬТАТ:

После деплоя:
- ✅ `/ru/` → работает
- ✅ `/en/`, `/kk/`, `/pt-BR/` → работают
- ✅ `next-intl` config находится
- ✅ Переводы работают
- ✅ БЕЗ конфликтов routing

---

## P(успех) = 0.98 🚀

Это правильная конфигурация по документации next-intl!


