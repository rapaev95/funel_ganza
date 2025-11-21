# Инструкция по миграции из HTML в Next.js

## Что было сделано

Проект был переведен с чистого HTML/JS на Next.js с React и TypeScript.

## Изменения в структуре

### Старая структура:
```
├── index.html
├── script.js
├── style.css
├── season_*.html
├── season_style.css
├── slideshow.js
└── фото/
```

### Новая структура:
```
├── app/
│   ├── page.tsx              # Главная страница (было index.html)
│   ├── season/[seasonName]/  # Страницы сезонов (было season_*.html)
│   ├── api/analyze/          # API endpoint для анализа
│   └── globals.css           # Объединенные стили
├── components/               # React компоненты
├── lib/                      # Утилиты
└── public/фото/              # Изображения (без изменений)
```

## Миграция изображений

Изображения остаются в той же папке `фото/`, но теперь они должны быть в `public/фото/`:

1. Скопируйте папку `фото/` в `public/фото/`
2. Убедитесь, что все пути начинаются с `/фото/` (не `фото/`)

## Настройка n8n Webhook

### Формат запроса от Next.js:

```json
{
  "image": "data:image/jpeg;base64,...",
  "user_id": "123456789",
  "first_name": "Имя",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Формат ответа от n8n:

```json
{
  "season": "Зима",
  "colors": ["#000000", "#FFFFFF", "#DC143C", "#4B0082"],
  "description": "Тебе идеально подойдут глубокие, насыщенные тона.",
  "product_image": "https://example.com/hoodie.jpg",
  "product_name": "Худи черное базовое",
  "price": "2 990 ₽",
  "product_link": "https://www.wildberries.ru/catalog/123456789/detail.aspx"
}
```

## Настройка Facebook Pixel

1. Получите Pixel ID в Facebook Business Manager
2. Добавьте в `.env.local`:
   ```
   NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
   ```
3. События отслеживаются автоматически:
   - `PageView` - при загрузке страницы
   - `InitiateCheckout` - при начале анализа
   - `CompleteRegistration` - при завершении анализа
   - `Lead` - при отправке фото
   - `Purchase` - при клике на покупку

## Удаление старых файлов

После проверки, что все работает, можно удалить:

- `index.html`
- `script.js`
- `style.css`
- `season_*.html`
- `season_style.css`
- `slideshow.js`
- `update-slideshow-images.js`
- `preview_result.html`

**Внимание:** Не удаляйте папку `фото/` - она нужна!

## Проверка после миграции

1. ✅ Главная страница открывается
2. ✅ Загрузка фото работает
3. ✅ API отправляет запросы в n8n
4. ✅ Страницы сезонов открываются
5. ✅ Слайдшоу работает
6. ✅ Facebook Pixel загружается
7. ✅ Все изображения отображаются

## Следующие шаги

1. Загрузите проект на GitHub
2. Настройте деплой (см. DEPLOYMENT.md)
3. Протестируйте на реальном домене
4. Подключите n8n webhook
5. Настройте Facebook Pixel
6. Запустите тестовый трафик


