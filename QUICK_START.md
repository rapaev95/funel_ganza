# Быстрый старт - GANZA AI Stylist

## Шаг 1: Установка зависимостей

```bash
npm install
```

## Шаг 2: Перемещение изображений

Изображения должны быть в папке `public/фото/`:

```bash
# Windows
move фото public\фото

# Linux/Mac
mv фото public/фото
```

Или скопируйте папку `фото` в `public/` вручную.

## Шаг 3: Настройка переменных окружения

Создайте файл `.env.local`:

```env
# n8n Webhook URL для отправки фото на анализ (можно оставить пустым, будет использоваться значение по умолчанию)
N8N_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/upload-image

# Facebook Pixel ID
NEXT_PUBLIC_FB_PIXEL_ID=989549929881045

# n8n Webhook URL для аналитики (Facebook Conversion API)
N8N_CAPI_WEBHOOK_URL=https://n8n-biqby-u59940.vm.elestio.app/webhook/capi-events

# URL сайта (для локальной разработки)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Важно:** Пока не заполняйте реальные значения, если их еще нет. Приложение будет работать, но некоторые функции не будут доступны.

## Шаг 4: Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Шаг 5: Проверка работы

1. ✅ Главная страница открывается
2. ✅ Можно загрузить фото
3. ✅ Страницы сезонов открываются (`/season/winter`)
4. ✅ Слайдшоу работает

## Что дальше?

1. **Настройте n8n webhook:**
   - Создайте workflow в n8n
   - Скопируйте URL webhook
   - Добавьте в `.env.local` как `N8N_WEBHOOK_URL`

2. **Настройте Facebook Pixel:**
   - Создайте Pixel в Facebook Business Manager
   - Скопируйте Pixel ID
   - Добавьте в `.env.local` как `NEXT_PUBLIC_FB_PIXEL_ID`

3. **Загрузите на GitHub:**
   - Создайте репозиторий
   - Закоммитьте код
   - Загрузите на GitHub

4. **Задеплойте:**
   - См. инструкцию в `DEPLOYMENT.md`

## Структура проекта

```
├── app/                    # Next.js страницы и API
│   ├── page.tsx           # Главная страница
│   ├── season/            # Страницы сезонов
│   └── api/analyze/       # API для анализа фото
├── components/            # React компоненты
├── lib/                   # Утилиты
├── public/                # Статические файлы
│   └── фото/             # Изображения (должна быть здесь!)
└── package.json
```

## Проблемы?

### Изображения не отображаются

Убедитесь, что папка `фото` находится в `public/фото/`, а не в корне проекта.

### Ошибка при запуске

1. Убедитесь, что Node.js версии 18+ установлен
2. Удалите `node_modules` и `.next`
3. Запустите `npm install` снова

### n8n webhook не работает

Пока не настроен webhook, приложение будет показывать ошибку при анализе. Это нормально. После настройки webhook все заработает.


