# n8n Workflow - Обработка изображений и интеграция с Supabase

## Описание

Workflow для обработки изображений пользователей: загрузка в Supabase Storage, анализ через OpenAI, сохранение результатов в Supabase БД.

## Структура workflow

1. **Webhook** - Прием данных из React (multipart/form-data)
2. **Code - Парсинг данных** (`01-parse-data.js`)
   - Парсит метаданные и UTM параметры
   - Подготавливает данные для следующих нод
3. **HTTP Request - Поиск пользователя** (см. `http-request-nodes.md`)
   - Ищет пользователя по `tg_user_id` используя credential "vibelook"
4. **Code - Проверка результата поиска** (см. `http-request-nodes.md`)
5. **IF - should_create_user** - проверка, нужно ли создавать пользователя
6. **HTTP Request - Создание пользователя** (если нужно, см. `http-request-nodes.md`)
7. **Code - Объединение результатов пользователя** (см. `http-request-nodes.md`)
8. **HTTP Request - Подсчет сессий пользователя** (см. `http-request-nodes.md`)
9. **Code - Подсчет сессий и проверка лимита** (см. `http-request-nodes.md`)
10. **HTTP Request - Проверка существования сессии** (см. `http-request-nodes.md`)
11. **Code - Проверка сессии и лимита** (см. `http-request-nodes.md`)
12. **IF - Проверка лимита** - если превышен, останавливаем workflow
13. **HTTP Request - Загрузка selfie** (`02-upload-selfie-config.md`)
14. **Code - Формирование selfie_url** (`03-format-selfie-url.js`)
15. **HTTP Request - Загрузка fullbody** (`04-upload-fullbody-config.md`)
16. **Code - Формирование fullbody_url** (`05-format-fullbody-url.js`)
17. **Code - Объединение URL** (`06-merge-urls.js`)
18. **HTTP Request/Code - Создание/обновление сессии (UPSERT)** (`08-create-session-http-request.md`)
   - Сначала PATCH (обновление), если не найдено - POST (создание)
   - Предотвращает ошибку "Duplicate" при повторной загрузке

**Важно**: Все HTTP Request ноды используют credential "vibelook" (Supabase API) для аутентификации.

## Credentials

Все HTTP Request ноды используют credential **"vibelook"** (Supabase API).

Убедитесь, что credential "vibelook" настроен правильно:
- Тип: Supabase API
- Service Role Key: ваш ключ из Supabase (Settings → API → service_role key)

## Установка

1. Скопируйте коды из файлов `.js` в соответствующие Code ноды в n8n
2. Настройте HTTP Request ноды согласно инструкциям в файлах `.md`
3. Убедитесь, что все переменные окружения установлены
4. Проверьте, что bucket `foto_client` существует в Supabase Storage

## Формат данных из webhook

Webhook ожидает multipart/form-data с полями:

- `session_id` (string) - уникальный ID сессии
- `image_1` (file) - селфи
- `image_2` (file) - фото в полный рост
- `image_count` (string) - количество изображений
- `age` (string) - возраст
- `gender` (string) - пол
- `budget_preference` (string) - предпочтения по бюджету
- `utm_data` (JSON string) - UTM параметры
- `user_id` (string, optional) - Telegram user ID
- `first_name` (string, optional) - имя пользователя

## Структура путей в Storage

- Selfie: `user_images/<user_id>/session_<session_id>/selfie.jpg`
- Fullbody: `user_images/<user_id>/session_<session_id>/fullbody.jpg`

## Особенности

- **UPSERT для сессий**: При повторной загрузке с тем же `session_id` сессия обновляется, а не создается заново
- **Автоматическое создание пользователей**: Если пользователь с `tg_user_id` не найден, он создается автоматически
- **Проверка существования**: Перед созданием сессии проверяется, существует ли она уже

## Следующие шаги

После создания/обновления сессии можно добавить:
- OpenAI анализ изображений
- Обновление сессии результатами анализа
- Формирование result_link
- Отправка webhook в Next.js

