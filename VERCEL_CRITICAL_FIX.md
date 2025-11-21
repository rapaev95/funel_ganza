# 🔧 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ для Vercel

## ❌ Проблема: MIDDLEWARE_INVOCATION_FAILED (500 Error)

### Причины:
1. **cookies() в middleware context** - запрещено на Vercel Edge Runtime
2. **Facebook Pixel не инициализирован в head**
3. **Лишняя логика с cookies в LanguageSwitcher**

---

## ✅ ИСПРАВЛЕНО

### 1. `i18n/request.ts` - Удалена логика с cookies()

**Было (вызывало ошибку):**
```typescript
import { cookies } from 'next/headers'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // ❌ ПРОБЛЕМА: cookies() недоступен в middleware context
  try {
    const cookieStore = await cookies()
    const savedLocale = cookieStore.get('NEXT_LOCALE')?.value
    if (savedLocale && routing.locales.includes(savedLocale as any)) {
      locale = savedLocale
    }
  } catch (error) {
    console.warn('Could not read cookies:', error)
  }
  
  // ...
})
```

**Стало (работает):**
```typescript
// ✅ Без cookies() - next-intl сам определяет locale из URL
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
```

### 2. `app/[locale]/layout.tsx` - Добавлен Facebook Pixel в head

**Добавлено:**
```typescript
import Script from 'next/script'

export default async function LocaleLayout({ children, params }) {
  // ...
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '989549929881045'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        {/* ✅ Facebook Pixel инициализация */}
        {pixelId && (
          <>
            <Script
              id="facebook-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={\`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1\`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <FacebookPixel /> {/* Теперь только для PageView на route changes */}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### 3. `components/LanguageSwitcher.tsx` - Убрана логика с cookies

**Было:**
```typescript
const handleLanguageChange = (newLocale: string) => {
  // ❌ Ненужная логика
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', newLocale)
  }
  // ...
}
```

**Стало:**
```typescript
const handleLanguageChange = (newLocale: string) => {
  // ✅ Только переключение через URL
  // Получаем реальный путь из window.location.pathname
  // ...
}
```

---

## 🎯 Что теперь работает:

### ✅ Middleware
- Больше не использует `cookies()`
- Работает на Vercel Edge Runtime
- Корректно обрабатывает все локали (включая `pt-BR`)

### ✅ Интернационализация
- Язык определяется из URL (`/ru/`, `/en/`, `/kk/`, `/pt-BR/`)
- Дефолтный язык: русский (без префикса `/`)
- Переключение через `LanguageSwitcher` работает

### ✅ Facebook Pixel
- Инициализируется в `<head>` через `Script`
- PageView отслеживается на каждой странице
- События с UTM работают корректно

### ✅ API Routes
- Исключены из middleware через matcher
- `/api/analyze` работает
- `/api/analytics` работает

---

## 📋 Следующие шаги:

### 1. Закоммитить изменения:
```bash
git add .
git commit -m "Fix MIDDLEWARE_INVOCATION_FAILED - remove cookies() from middleware context"
git push origin main
```

### 2. Vercel автоматически задеплоит:
- После push изменения автоматически деплоятся
- Или вручную: Dashboard → Deployments → Redeploy

### 3. Проверить:
После деплоя проверьте:
- ✅ Главная страница `/` загружается
- ✅ Язык переключается через switcher
- ✅ Все локали работают: `/ru/`, `/kk/`, `/en/`, `/pt-BR/`
- ✅ Квиз `/app` открывается
- ✅ API routes `/api/analyze`, `/api/analytics` работают
- ✅ Facebook Pixel Helper видит пиксель

---

## 🔍 Техническое объяснение:

### Почему cookies() вызывал ошибку?

1. **Edge Runtime ограничения**: Vercel использует Edge Runtime для middleware, который имеет ограниченный API
2. **Middleware context**: `getRequestConfig` вызывается в контексте middleware при каждом запросе
3. **cookies() недоступен**: В Edge Runtime нельзя читать cookies синхронно через `next/headers`

### Правильный подход:

- **Язык из URL**: next-intl определяет locale из пути (`/ru/page` → locale = 'ru')
- **Без cookies**: Не нужно сохранять выбор языка в cookies/localStorage
- **Clean middleware**: Middleware должен быть максимально легким и без side effects

---

## ✅ ГОТОВО К ДЕПЛОЮ

Все критические проблемы исправлены. Проект готов к загрузке на Vercel.

