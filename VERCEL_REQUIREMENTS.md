# ✅ Vercel Requirements Checklist

## Статус проекта: ГОТОВ К ДЕПЛОЮ ✅

---

## 1. Структура проекта ✅

```
funel_ganza/
├── app/
│   ├── [locale]/                 ✅ Next.js App Router
│   │   ├── layout.tsx           ✅ Root layout
│   │   ├── page.tsx             ✅ Landing page
│   │   ├── app/
│   │   │   └── page.tsx         ✅ Quiz page
│   │   └── season/
│   │       └── [seasonName]/
│   │           └── page.tsx     ✅ Season pages
│   ├── api/
│   │   ├── analyze/route.ts     ✅ API route for analysis
│   │   └── analytics/route.ts   ✅ API route for analytics
│   ├── globals.css              ✅ Global styles
│   ├── robots.ts                ✅ SEO
│   └── sitemap.ts               ✅ SEO
├── components/                   ✅ React components
├── lib/                          ✅ Utilities
├── messages/                     ✅ Translations
├── public/                       ✅ Static assets
├── i18n/                         ✅ i18n config
├── types/                        ✅ TypeScript types
├── middleware.ts                 ✅ Next.js middleware
├── next.config.js                ✅ Next.js config
├── tsconfig.json                 ✅ TypeScript config
├── package.json                  ✅ Dependencies
└── .gitignore                    ✅ Git ignore
```

---

## 2. package.json ✅

### Обязательные поля:
- ✅ `name`: "ganza-ai-stylist"
- ✅ `version`: "0.1.0"
- ✅ `scripts.build`: "next build"
- ✅ `scripts.start`: "next start"
- ✅ `dependencies.next`: "14.2.5"
- ✅ `dependencies.react`: "^18.3.1"

### Все зависимости установлены:
```json
{
  "dependencies": {
    "next": "14.2.5",
    "next-intl": "^3.19.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.14.10",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.3"
  }
}
```

---

## 3. next.config.js ✅

```javascript
const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,  // Для статических изображений
  },
}

module.exports = withNextIntl(nextConfig)
```

**Настройки Vercel-совместимые:**
- ✅ Используется `next-intl` плагин
- ✅ `reactStrictMode` включен
- ✅ Изображения настроены

---

## 4. TypeScript конфигурация ✅

### tsconfig.json:
- ✅ `"target": "ES2020"`
- ✅ `"strict": true`
- ✅ `"jsx": "preserve"`
- ✅ `"moduleResolution": "bundler"`
- ✅ Path aliases настроены: `"@/*": ["./*"]`

### TypeScript ошибки:
- ✅ **Исправлено**: `components/UnifiedQuiz.tsx` - тип `questionsCompleted`

---

## 5. Переменные окружения ✅

### Обязательные для Vercel:

**N8N Webhooks:**
```
N8N_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/upload-image
N8N_CAPI_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/capi-events
```

**Facebook Pixel:**
```
NEXT_PUBLIC_FB_PIXEL_ID=989549929881045
```

**Site URL:**
```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

⚠️ **Важно**: 
- Переменные с `NEXT_PUBLIC_` доступны на клиенте
- Переменные без `NEXT_PUBLIC_` доступны только на сервере

---

## 6. .gitignore ✅

Критичные файлы исключены:
- ✅ `/node_modules`
- ✅ `/.next/`
- ✅ `/out/`
- ✅ `.env*.local`
- ✅ `.vercel`
- ✅ `*.tsbuildinfo`

---

## 7. Build настройки для Vercel ✅

### Framework Detection:
Vercel автоматически определит Next.js

### Build Command:
```bash
npm run build
```

### Output Directory:
```
.next
```

### Install Command:
```bash
npm install
```

### Node.js Version:
Используется Node.js 18.x (по умолчанию Vercel)

---

## 8. API Routes ✅

- ✅ `/api/analyze` - обработка фото
- ✅ `/api/analytics` - отправка событий в n8n

**Требования выполнены:**
- ✅ Используют `NextRequest`, `NextResponse`
- ✅ Обрабатывают ошибки
- ✅ Возвращают JSON
- ✅ CORS не требуется (same-origin)

---

## 9. Middleware ✅

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
  ...routing,
  localeDetection: false
})

export const config = {
  matcher: [
    '/',
    '/app',
    '/app/:path*',
    '/(ru|kk|en|pt-BR)/:path*'
  ]
}
```

- ✅ Правильно настроен для next-intl
- ✅ Matcher указан корректно
- ✅ Автодетект языка отключен

---

## 10. Интернационализация ✅

### Поддерживаемые языки:
- ✅ Русский (ru) - по умолчанию
- ✅ Казахский (kk)
- ✅ Английский (en)
- ✅ Португальский (pt-BR)

### Файлы переводов:
- ✅ `messages/ru.json`
- ✅ `messages/kk.json`
- ✅ `messages/en.json`
- ✅ `messages/pt-BR.json`

---

## 11. Статические файлы ✅

### public/ директория:
- ✅ `/public/foto/` - изображения для seasons
- ✅ Все изображения оптимизированы

---

## 12. Routing структура ✅

### Страницы:
- ✅ `/` (лендинг)
- ✅ `/app` (квиз)
- ✅ `/season/[seasonName]` (результаты)

### Локализованные URL:
- ✅ `/ru/` (русский)
- ✅ `/kk/` (казахский)
- ✅ `/en/` (английский)
- ✅ `/pt-BR/` (португальский)

---

## 13. Facebook Pixel ✅

- ✅ Инициализация в `app/[locale]/layout.tsx`
- ✅ ID: `989549929881045`
- ✅ События отслеживаются:
  - `PageView`
  - `ClickCTA`
  - `StartQuiz`
  - `InitiateCheckout`
  - `PhotoUploaded`
  - `ResultView`
  - `ClickBuyHoodie`
  - `Purchase`
- ✅ `event_id` для дедупликации

---

## 14. UTM Analytics ✅

- ✅ Сбор UTM на лендинге
- ✅ Передача через Telegram `startapp`
- ✅ Сквозная аналитика до покупки
- ✅ Отправка в n8n webhook

---

## 15. Telegram WebApp ✅

- ✅ SDK подключен: `telegram-web-app.js`
- ✅ `window.Telegram.WebApp` используется
- ✅ `user_id` извлекается
- ✅ `startapp` параметр обрабатывается

---

## 🚀 Готовность к деплою: 100%

### Что делать:

1. **Загрузить на GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Создать проект на Vercel:**
   - Перейти на [vercel.com](https://vercel.com)
   - Import repository
   - Добавить Environment Variables

3. **Deploy:**
   - Нажать "Deploy"
   - Дождаться завершения

4. **После деплоя:**
   - Обновить `NEXT_PUBLIC_SITE_URL`
   - Настроить Telegram Bot
   - Протестировать

---

## 📋 Environment Variables для Vercel:

Скопируйте и вставьте в Vercel Dashboard:

```
N8N_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/upload-image
N8N_CAPI_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/capi-events
NEXT_PUBLIC_FB_PIXEL_ID=989549929881045
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
```

---

## ✅ Все проверки пройдены!

Проект полностью готов к деплою на Vercel.


