# Инструкция по деплою GANZA AI Stylist

## Подготовка к деплою

### 1. Настройка переменных окружения

Создайте файл `.env.local` с следующими переменными:

```env
# n8n Webhook URL для отправки фото на анализ
N8N_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/upload-image

# n8n Webhook URL для отправки событий аналитики (Facebook Conversion API)
N8N_CAPI_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/capi-events

# Facebook Pixel ID
NEXT_PUBLIC_FB_PIXEL_ID=989549929881045

# Facebook Conversion API (опционально)
FB_ACCESS_TOKEN=your_access_token_here

# URL сайта (для sitemap и robots.txt)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Проверка перед деплоем

- [ ] Все переменные окружения заполнены
- [ ] n8n webhook настроен и протестирован
- [ ] Facebook Pixel ID получен
- [ ] Изображения загружены в папку `public/фото/`

## Деплой на Vercel (рекомендуется)

### Шаг 1: Подготовка репозитория

1. Убедитесь, что код загружен в GitHub/GitLab/Bitbucket
2. Проверьте, что `.env.local` не закоммичен (должен быть в `.gitignore`)

### Шаг 2: Создание проекта в Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Импортируйте ваш репозиторий
4. Настройте проект:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (или оставьте пустым)
   - **Build Command**: `npm run build` (по умолчанию)
   - **Output Directory**: `.next` (по умолчанию)

### Шаг 3: Добавление переменных окружения

В настройках проекта Vercel:

1. Перейдите в **Settings** → **Environment Variables**
2. Добавьте все переменные из `.env.local`:
   - `N8N_WEBHOOK_URL`
   - `NEXT_PUBLIC_FB_PIXEL_ID`
   - `FB_ACCESS_TOKEN` (опционально)
   - `NEXT_PUBLIC_SITE_URL`

3. Выберите окружения (Production, Preview, Development)

### Шаг 4: Деплой

1. Нажмите "Deploy"
2. Дождитесь завершения сборки
3. Скопируйте URL вашего приложения

### Шаг 5: Настройка Telegram Mini App

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота
4. Выберите "Bot Settings" → "Menu Button"
5. Введите:
   - **Button text**: "Открыть стилиста"
   - **URL**: `https://your-vercel-app.vercel.app`

## Деплой на другие платформы

### Netlify

1. Подключите репозиторий к Netlify
2. Настройки сборки:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
3. Добавьте переменные окружения в настройках
4. Деплой произойдет автоматически

### Railway

1. Создайте новый проект в Railway
2. Подключите репозиторий
3. Railway автоматически определит Next.js
4. Добавьте переменные окружения в настройках
5. Деплой произойдет автоматически

### Self-hosted (VPS)

1. Установите Node.js 18+ на сервер
2. Клонируйте репозиторий
3. Установите зависимости: `npm install`
4. Создайте `.env.local` с переменными
5. Соберите проект: `npm run build`
6. Запустите: `npm start`
7. Настройте reverse proxy (nginx) для домена

## Проверка после деплоя

### 1. Проверка основных страниц

- [ ] Главная страница открывается: `https://your-domain.com`
- [ ] Страницы сезонов работают: `https://your-domain.com/season/winter`
- [ ] Загрузка фото работает
- [ ] API endpoint отвечает: `https://your-domain.com/api/analyze`

### 2. Проверка интеграций

- [ ] n8n webhook получает запросы
- [ ] Facebook Pixel загружается (проверьте в Facebook Events Manager)
- [ ] Telegram Web App SDK загружается

### 3. Проверка аналитики

1. Откройте Facebook Events Manager
2. Проверьте, что события приходят:
   - `PageView`
   - `InitiateCheckout`
   - `CompleteRegistration`
   - `Lead`
   - `Purchase`

## Обновление приложения

После внесения изменений:

1. Закоммитьте изменения в репозиторий
2. Push в основную ветку
3. Vercel/Netlify автоматически задеплоят обновления
4. Проверьте, что все работает

## Troubleshooting

### Проблема: n8n webhook не получает запросы

**Решение:**
- Проверьте URL в переменных окружения
- Убедитесь, что webhook активен в n8n
- Проверьте логи в Vercel/Netlify

### Проблема: Facebook Pixel не работает

**Решение:**
- Проверьте Pixel ID в переменных окружения
- Убедитесь, что используется `NEXT_PUBLIC_` префикс
- Проверьте консоль браузера на ошибки

### Проблема: Изображения не загружаются

**Решение:**
- Убедитесь, что папка `public/фото/` загружена
- Проверьте пути к изображениям (должны начинаться с `/фото/`)
- Проверьте права доступа к файлам

### Проблема: Telegram Mini App не открывается

**Решение:**
- Проверьте URL в настройках бота
- Убедитесь, что сайт доступен по HTTPS
- Проверьте, что Telegram Web App SDK загружается

## Мониторинг

Рекомендуется настроить:

1. **Vercel Analytics** - для отслеживания производительности
2. **Sentry** - для отслеживания ошибок
3. **Facebook Events Manager** - для отслеживания конверсий
4. **n8n logs** - для отслеживания обработки запросов


