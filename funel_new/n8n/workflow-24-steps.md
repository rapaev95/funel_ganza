# n8n Workflow: Обработка изображений и анализ стиля (24+ шага)

## Обзор workflow

Этот workflow обрабатывает изображения пользователей, анализирует их стилистические параметры через OpenAI GPT-4.0 и отправляет результаты обратно в React приложение.

**Основной поток:**
1. Получение данных из React (webhook)
2. Поиск/создание пользователя в Supabase
3. Проверка лимитов бесплатных запросов
4. Загрузка изображений в Supabase Storage
5. Создание/обновление сессии
6. Анализ изображений через OpenAI (selfie и fullbody)
7. Выбор лучшего изображения и суммирование результатов
8. Отправка webhook callback в React

---

## Шаг 1: Webhook - Прием данных из React

**Тип ноды**: Webhook  
**Название**: "Инфа из квиза"

**Настройки:**
- **HTTP Method**: POST
- **Path**: `upload-image`
- **Response Mode**: Last Node
- **Response Data**: All Entries

**Принимаемые данные:**
- `session_id` (string) - ID сессии
- `image_1` (file) - Selfie изображение
- `image_2` (file) - Fullbody изображение
- `image_count` (string) - Количество изображений
- `age`, `gender`, `budget_preference` (string)
- `utm_data` (JSON string) - UTM параметры
- `user_id` (string) - Telegram ID пользователя
- `first_name` (string) - Имя пользователя

**Примечание**: Эта нода является триггером workflow. Все последующие ноды получают данные из этой ноды.

---

## Шаг 2: Code - Парсинг данных

**Тип ноды**: Code  
**Название**: "Парсинг"  
**Файл**: `funel_new/n8n/01-parse-data.js`

**Функция:**
- Извлекает метаданные из webhook
- Парсит UTM данные из JSON строки
- Сохраняет binary данные изображений
- Подготавливает данные для следующих нод

**Выходные данные:**
- `session_id`, `tg_user_id`, `first_name`, `age`, `gender`, `budget_preference`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`
- `has_image_1`, `has_image_2`
- `max_free_requests` (константа: 5)
- Binary данные изображений

**Подключение**: 
- Вход: Шаг 1 (Webhook)
- Выход: Шаг 3 (Merge) и Шаг 4 (HTTP Request - Поиск пользователя)

---

## Шаг 3: Merge - Объединение данных

**Тип ноды**: Merge  
**Название**: "Merge"

**Настройки:**
- **Mode**: Merge By Index
- **Merge**: All Inputs

**Функция**: Объединяет данные из парсинга (Шаг 2) с результатом поиска пользователя (Шаг 4).

**Подключение**:
- Вход 1: Шаг 2 (Парсинг)
- Вход 2: Шаг 4 (HTTP Request - Поиск пользователя)
- Выход: Шаг 6 (Code - Проверка результата)

---

## Шаг 4: HTTP Request - Поиск пользователя

**Тип ноды**: HTTP Request  
**Название**: "ПОИСК ЮЗЕРА"

**Настройки:**
- **Method**: GET
- **URL**: 
  ```
  https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/users?tg_user_id=eq.{{ $json.tg_user_id }}&select=id,first_name,tg_user_id
  ```
- **Authentication**: Supabase API
- **Credential**: VIBELOOK

**Headers:**
```
Content-Type: application/json
```

**Функция**: Ищет пользователя в таблице `users` по `tg_user_id`.

**Выходные данные:**
- Массив с найденным пользователем: `[{ id, first_name, tg_user_id }]`
- Или пустой массив `[]`, если пользователь не найден

**Подключение**:
- Вход: Шаг 1 (Webhook) - получает `tg_user_id` из исходных данных
- Выход: Шаг 3 (Merge)

---

## Шаг 5: Code - Проверка результата поиска

**Тип ноды**: Code  
**Название**: "Проверка результата"  
**Файл**: `funel_new/n8n/02-check-user-search-result.js`

**Функция:**
- Проверяет, найден ли пользователь (проверяет наличие UUID в `id`)
- Устанавливает флаги: `user_found`, `should_create_user`
- Если пользователь найден: возвращает `user_id` (UUID)

**Выходные данные:**
- `user_id` (UUID) - если пользователь найден
- `user_found`: true/false
- `should_create_user`: true/false
- Все исходные данные из парсинга

**Подключение**:
- Вход: Шаг 3 (Merge)
- Выход: Шаг 7 (IF)

---

## Шаг 6: IF - Проверка should_create_user

**Тип ноды**: IF  
**Название**: "If"

**Условие:**
```
{{ $json.should_create_user === true }}
```

**Ветвление:**
- **True** → Шаг 8 (HTTP Request - Создание пользователя)
- **False** → Шаг 9 (Code - Объединение результатов пользователя)

**Подключение**:
- Вход: Шаг 5 (Code - Проверка результата)

---

## Шаг 7: HTTP Request - Создание пользователя

**Тип ноды**: HTTP Request  
**Название**: "Создать пользователя"

**Настройки:**
- **Method**: POST
- **URL**: `https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/users`
- **Authentication**: Supabase API
- **Credential**: VIBELOOK

**Headers:**
```
Content-Type: application/json
Prefer: return=representation
```

**Body (JSON):**
```json
{
  "tg_user_id": "{{ $json.tg_user_id }}",
  "first_name": "{{ $json.first_name }}",
  "language": "ru"
}
```

**Функция**: Создает нового пользователя в таблице `users`.

**Выходные данные:**
- `id` (UUID) - ID созданного пользователя
- `tg_user_id`, `first_name`

**Подключение**:
- Вход: Шаг 6 (IF - True ветка)
- Выход: Шаг 9 (Code - Объединение результатов пользователя)

---

## Шаг 8: Code - Объединение результатов пользователя

**Тип ноды**: Code  
**Название**: "Объединение результатов пользователя"  
**Файл**: `funel_new/n8n/04-merge-user-results.js`

**Функция:**
- Извлекает `user_id` (UUID) из результата поиска или создания пользователя
- Объединяет все данные для дальнейшей обработки

**Выходные данные:**
- `user_id` (UUID) - обязательное поле для следующих нод
- Все исходные данные

**Подключение**:
- Вход 1: Шаг 6 (IF - False ветка) - пользователь найден
- Вход 2: Шаг 7 (HTTP Request - Создание пользователя) - пользователь создан
- Выход: Шаг 10 (HTTP Request - Подсчет сессий) и Шаг 19 (Merge3)

---

## Шаг 9: HTTP Request - Подсчет сессий пользователя

**Тип ноды**: HTTP Request  
**Название**: "Подсчет сессий пользователя"

**Настройки:**
- **Method**: GET
- **URL**: 
  ```
  https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/sessions?user_id=eq.{{ $json.user_id }}&select=id
  ```
- **Authentication**: Supabase API
- **Credential**: VIBELOOK

**Функция**: Подсчитывает количество существующих сессий пользователя.

**Выходные данные:**
- Массив с ID сессий: `[{ id }, { id }, ...]`

**Подключение**:
- Вход: Шаг 8 (Code - Объединение результатов пользователя)
- Выход: Шаг 11 (Code - Подсчет сессий)

---

## Шаг 10: Code - Подсчет сессий и проверка лимита

**Тип ноды**: Code  
**Название**: "Подсчет сессий"  
**Файл**: `funel_new/n8n/08-count-sessions-and-limit.js`

**Функция:**
- Подсчитывает количество сессий из результата HTTP Request
- Сравнивает с максимальным количеством бесплатных запросов (5)
- Устанавливает флаг `limit_exceeded`

**Выходные данные:**
- `sessions_count` - количество сессий
- `limit_exceeded`: true/false
- `max_free_requests`: 5

**Подключение**:
- Вход: Шаг 9 (HTTP Request - Подсчет сессий)
- Выход: Шаг 12 (IF1)

---

## Шаг 11: IF - Проверка лимита

**Тип ноды**: IF  
**Название**: "If1"

**Условие:**
```
{{ $json.limit_exceeded === false }}
```

**Ветвление:**
- **True** → Шаг 13 (Merge1) - продолжаем обработку
- **False** → Остановка workflow (лимит превышен)

**Подключение**:
- Вход: Шаг 10 (Code - Подсчет сессий)

---

## Шаг 12: Merge - Объединение для загрузки изображений

**Тип ноды**: Merge  
**Название**: "Merge1"

**Настройки:**
- **Mode**: Merge By Index
- **Merge**: All Inputs

**Функция**: Объединяет данные пользователя с binary данными изображений для загрузки в Storage.

**Подключение**:
- Вход 1: Шаг 2 (Парсинг) - binary данные изображений
- Вход 2: Шаг 11 (IF1 - True ветка) - данные пользователя
- Выход: Шаг 14 и Шаг 16 (HTTP Request - Загрузка изображений)

---

## Шаг 13: HTTP Request - Загрузка selfie в Storage

**Тип ноды**: HTTP Request  
**Название**: "СОХРАНИТЬ SELFIE"

**Настройки:**
- **Method**: PUT
- **URL**: 
  ```
  https://pflgjjcbmpqoqsqzdfto.supabase.co/storage/v1/object/foto_client/user_images/{{ $json.body.user_id }}/session_{{ $json.session_id }}/selfie.jpg
  ```
- **Authentication**: Supabase API
- **Credential**: VIBELOOK

**Headers:**
```
Content-Type: {{ $binary.image_1.mimeType || "image/jpeg" }}
```

**Body**: Binary Data - `image_1`

**Функция**: Загружает selfie изображение в Supabase Storage (bucket `foto_client`).

**Выходные данные:**
- `Key` - путь к файлу в Storage
- `Id` - ID загруженного файла

**Подключение**:
- Вход: Шаг 12 (Merge1)
- Выход: Шаг 15 (Code - Формирование selfie_url)

---

## Шаг 14: Code - Формирование selfie_url

**Тип ноды**: Code  
**Название**: "ССЫЛКА SELFIE"  
**Файл**: `funel_new/n8n/03-format-selfie-url.js`

**Функция:**
- Получает `Key` из ответа Supabase Storage
- Формирует публичный URL для selfie изображения

**Выходные данные:**
- `selfie_url` - публичный URL изображения
- `uploadKey_selfie`, `uploadId_selfie`

**Формат URL:**
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/storage/v1/object/public/foto_client/user_images/{user_id}/session_{session_id}/selfie.jpg
```

**Подключение**:
- Вход: Шаг 13 (HTTP Request - Загрузка selfie)
- Выход: Шаг 17 (Merge2)

---

## Шаг 15: HTTP Request - Загрузка fullbody в Storage

**Тип ноды**: HTTP Request  
**Название**: "СОХРАНИТЬ FULLBODY"

**Настройки:**
- **Method**: PUT
- **URL**: 
  ```
  https://pflgjjcbmpqoqsqzdfto.supabase.co/storage/v1/object/foto_client/user_images/{{ $json.body.user_id || $json.body.session_id }}/session_{{ $json.body.session_id }}/fullbody.jpg
  ```
- **Authentication**: Supabase API
- **Credential**: VIBELOOK

**Body**: Binary Data - `image_2`

**Функция**: Загружает fullbody изображение в Supabase Storage.

**Выходные данные:**
- `Key` - путь к файлу в Storage
- `Id` - ID загруженного файла

**Подключение**:
- Вход: Шаг 12 (Merge1)
- Выход: Шаг 16 (Code - Формирование fullbody_url)

---

## Шаг 16: Code - Формирование fullbody_url

**Тип ноды**: Code  
**Название**: "ССЫЛКА SELFIE1" (переименовать в "ССЫЛКА FULLBODY")  
**Файл**: `funel_new/n8n/05-format-fullbody-url.js`

**Функция:**
- Получает `Key` из ответа Supabase Storage
- Формирует публичный URL для fullbody изображения

**Выходные данные:**
- `fullbody_url` - публичный URL изображения
- `uploadKey_fullbody`, `uploadId_fullbody`

**Подключение**:
- Вход: Шаг 15 (HTTP Request - Загрузка fullbody)
- Выход: Шаг 17 (Merge2)

---

## Шаг 17: Merge - Объединение URL изображений

**Тип ноды**: Merge  
**Название**: "Merge2"

**Настройки:**
- **Mode**: Merge By Index
- **Merge**: All Inputs

**Функция**: Объединяет `selfie_url` и `fullbody_url` в один элемент данных.

**Подключение**:
- Вход 1: Шаг 14 (Code - Формирование selfie_url)
- Вход 2: Шаг 16 (Code - Формирование fullbody_url)
- Выход: Шаг 18 (Merge3)

---

## Шаг 18: Merge - Объединение данных для создания сессии

**Тип ноды**: Merge  
**Название**: "Merge3"

**Настройки:**
- **Mode**: Merge By Index
- **Merge**: All Inputs

**Функция**: Объединяет данные пользователя (`user_id`) с URL изображений для создания/обновления сессии.

**Подключение**:
- Вход 1: Шаг 8 (Code - Объединение результатов пользователя) - `user_id`
- Вход 2: Шаг 17 (Merge2) - `selfie_url`, `fullbody_url`
- Выход: Шаг 20 (Supabase - Попытка обновления сессии)

---

## Шаг 19: Supabase - Попытка обновления сессии

**Тип ноды**: Supabase  
**Название**: "18: Supabase - Попытка обновления сессии"

**Настройки:**
- **Operation**: Update
- **Table**: `sessions`
- **Credential**: VIBELOOK

**Select Conditions** (для поиска сессии):
- **Field**: `session_id`
- **Condition**: Equals
- **Value**: `{{ $input.all().find(item => item.json.session_id)?.json.session_id || $json.session_id }}`

**Fields to Update:**
- `user_id`: `{{ $input.all().find(item => item.json.user_id)?.json.user_id || $json.user_id }}`
- `session_id`: `{{ $input.all().find(item => item.json.session_id)?.json.session_id || $json.session_id }}`
- `image_count`: `{{ $input.all().find(item => item.json.image_count)?.json.image_count || $json.image_count || 2 }}`
- `age`: `{{ $input.all().find(item => item.json.age)?.json.age || $json.age }}`
- `gender`: `{{ $input.all().find(item => item.json.gender)?.json.gender || $json.gender }}`
- `budget_preference`: `{{ $input.all().find(item => item.json.budget_preference)?.json.budget_preference || $json.budget_preference }}`
- `selfie_url`: `{{ $input.all().find(item => item.json.selfie_url)?.json.selfie_url || $json.selfie_url }}`
- `fullbody_url`: `{{ $input.all().find(item => item.json.fullbody_url)?.json.fullbody_url || $json.fullbody_url }}`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`: аналогично

**Options:**
- **Return All**: ON
- **Continue On Fail**: ON

**Функция**: Пытается обновить существующую сессию по `session_id`. Если сессия не найдена, операция завершится без ошибки.

**Выходные данные:**
- Массив с обновленной сессией: `[{ id, session_id, ... }]`
- Или пустой массив `[]`, если сессия не найдена

**Подключение**:
- Вход: Шаг 18 (Merge3)
- Выход: Шаг 21 (Code - Проверка результата обновления)

---

## Шаг 20: Code - Проверка результата обновления сессии

**Тип ноды**: Code  
**Название**: "Проверка сессии19"  
**Файл**: `funel_new/n8n/19-check-session-update-result.js`

**Функция:**
- Проверяет, была ли сессия обновлена (наличие `id` в результате)
- Устанавливает флаги: `session_updated`, `should_create_session`

**Выходные данные:**
- `session_db_id` (UUID) - если сессия обновлена
- `session_updated`: true/false
- `should_create_session`: true/false

**Подключение**:
- Вход: Шаг 19 (Supabase - Попытка обновления сессии)
- Выход: Шаг 22 (IF2)

---

## Шаг 21: IF - Проверка should_create_session

**Тип ноды**: IF  
**Название**: "If2"

**Условие:**
```
{{ $json.should_create_session === true }}
```

**Ветвление:**
- **True** → Шаг 23 (Supabase - Создание сессии)
- **False** → Шаг 24 (Merge5) - сессия уже существует

**Подключение**:
- Вход: Шаг 20 (Code - Проверка результата обновления)

---

## Шаг 22: Supabase - Создание сессии

**Тип ноды**: Supabase  
**Название**: "21: Создать сессию"

**Настройки:**
- **Operation**: Insert
- **Table**: `sessions`
- **Credential**: VIBELOOK

**Fields:**
- `user_id`: `{{ $input.all().find(item => item.json.user_id)?.json.user_id || $json.user_id }}`
- `session_id`: `{{ $input.all().find(item => item.json.session_id)?.json.session_id || $json.session_id }}`
- `image_count`: `{{ $input.all().find(item => item.json.image_count)?.json.image_count || $json.image_count || 2 }}`
- `age`, `gender`, `budget_preference`: аналогично
- `selfie_url`, `fullbody_url`: аналогично
- UTM параметры: аналогично

**Options:**
- **Return All**: ON

**Функция**: Создает новую сессию в таблице `sessions`.

**Выходные данные:**
- Массив с созданной сессией: `[{ id, session_id, ... }]`

**Подключение**:
- Вход: Шаг 21 (IF2 - True ветка)
- Выход: Шаг 24 (Merge5)

---

## Шаг 23: Code - Объединение результатов сессии

**Тип ноды**: Code  
**Название**: (создать новую ноду)  
**Файл**: `funel_new/n8n/22-merge-session-results.js`

**Функция:**
- Извлекает `session_db_id` (UUID) из результата создания или обновления сессии
- Объединяет все данные для анализа

**Выходные данные:**
- `session_db_id` (UUID) - обязательное поле
- Все исходные данные, включая `selfie_url`, `fullbody_url`

**Подключение**:
- Вход 1: Шаг 21 (IF2 - False ветка) - сессия обновлена
- Вход 2: Шаг 22 (Supabase - Создание сессии) - сессия создана
- Выход: Шаг 24 (Merge5)

---

## Шаг 24: Merge - Объединение данных для анализа

**Тип ноды**: Merge  
**Название**: "Merge5"

**Настройки:**
- **Mode**: Merge By Index
- **Merge**: All Inputs

**Функция**: Объединяет данные сессии с binary данными изображений для анализа через OpenAI.

**Подключение**:
- Вход 1: Шаг 23 (Code - Объединение результатов сессии) - данные сессии
- Вход 2: Шаг 2 (Парсинг) - binary данные изображений (через Merge)
- Выход: Шаг 25 и Шаг 27 (OpenAI - Анализ изображений)

---

## Шаг 25: OpenAI - Анализ selfie (лицо)

**Тип ноды**: OpenAI (LangChain)  
**Название**: "Analyze selfie"  
**Resource**: Image  
**Operation**: Analyze  
**Model**: `chatgpt-4o-latest` (GPT-4.0 Latest)

**Настройки:**
- **Input Type**: Image URL или Binary
- **Image**: `{{ $json.selfie_url }}` (URL изображения)
- **Temperature**: 0.3-0.5 (для детерминированных результатов)
- **Max Tokens**: 1000
- **Response Format**: JSON Object (JSON mode)

**Промпт для GPT-4.0:**

```
Ты — эксперт мирового уровня в визуальной колористике, стилистике и аналитике юнгианских архетипов.

ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ:
- Возраст: {{ $json.body.age }}
- Пол: {{ $json.body.gender }}

ТВОЯ ЗАДАЧА:
Проанализировать СЕЛФИ (фото лица) и определить качество изображения и стилистические параметры. Верни результат строго в формате JSON.

АНАЛИЗ КАЧЕСТВА ИЗОБРАЖЕНИЯ:
1. Оцени качество изображения лица (0-100): четкость лица, освещение, резкость
2. Определи, видно ли лицо четко (true/false)
3. Определи, подходит ли изображение для анализа (true/false). Если quality_score < 50 ИЛИ face_visible = false, то suitable_for_analysis = false

СТИЛИСТИЧЕСКИЙ АНАЛИЗ (только если suitable_for_analysis = true):
Анализируй ТОЛЬКО лицо: тон кожи, цвет волос, цвет глаз, форма лица, мимика, выражение лица.

ПАРАМЕТРЫ ДЛЯ ОПРЕДЕЛЕНИЯ:

1. color_temperature: Определи на основе тона кожи лица
   - Допустимые значения: "cool" | "warm" | "neutral"
   - cool: розовые/голубые подтоны кожи
   - warm: желтые/персиковые подтоны кожи
   - neutral: смешанные подтоны

2. color_season: Определи точный цветотип из 12 вариантов на основе комбинации кожи + волос + глаз
   - Допустимые значения (выбери ОДИН):
     "bright_winter" | "cool_winter" | "deep_winter" |
     "cool_summer" | "light_summer" | "soft_summer" |
     "warm_spring" | "light_spring" | "bright_spring" |
     "warm_autumn" | "soft_autumn" | "deep_autumn"
   - НЕ используй общие сезоны (winter, spring, summer, autumn)
   - Определи ТОЧНЫЙ подтип на основе яркости, контраста, температуры

3. contrast_level: Контраст между кожей, волосами и глазами
   - Допустимые значения: "high" | "medium" | "low"

4. face_shape: Форма лица
   - Допустимые значения: "oval" | "round" | "square" | "rectangle" | "triangle" | "inverted_triangle" | "diamond"

5. hair_color: Цвет волос
   - Допустимые значения: "black" | "dark_brown" | "brown" | "light_brown" | "dark_blonde" | "ash_blonde" | "cool_blonde" | "platinum_blonde" | "red" | "copper" | "grey"

ВАЖНО:
- НЕ определяй body_silhouette (тело не видно в селфи)
- НЕ определяй archetype (архетип лучше определяется по позе в fullbody, не в селфи)
- Если suitable_for_analysis = false, верни null для всех стилистических параметров
- Все значения должны строго соответствовать допустимым спискам выше

СТРУКТУРА JSON ОТВЕТА:
{
  "quality_score": 0-100,
  "face_visible": true/false,
  "suitable_for_analysis": true/false,
  "color_temperature": "cool" | "warm" | "neutral" | null,
  "color_season": "bright_winter" | ... | null,
  "contrast_level": "high" | "medium" | "low" | null,
  "face_shape": "oval" | ... | null,
  "hair_color": "black" | ... | null
}

Верни результат как валидный JSON объект.
```

**Выходные данные:**
- JSON объект с результатами анализа (в `choices[0].message.content`)

**Подключение**:
- Вход: Шаг 24 (Merge5)
- Выход: Шаг 26 (Code - Парсинг результатов selfie)

---

## Шаг 26: Code - Парсинг результатов selfie

**Тип ноды**: Code  
**Название**: (создать новую ноду)  
**Файл**: `funel_new/n8n/23-parse-selfie-analysis.js`

**Код:**
```javascript
const item = $input.item;

// Получаем ответ от OpenAI
const content = item.json.choices?.[0]?.message?.content;

if (!content) {
  throw new Error('No content in OpenAI response for selfie analysis');
}

// Парсим JSON
let analysisResult;
try {
  analysisResult = typeof content === 'string' ? JSON.parse(content) : content;
} catch (error) {
  throw new Error(`Failed to parse selfie analysis result: ${error.message}`);
}

// Валидация: проверяем, что suitable_for_analysis определен
if (analysisResult.suitable_for_analysis === undefined) {
  console.warn('suitable_for_analysis not found in response, defaulting to false');
  analysisResult.suitable_for_analysis = false;
}

// Если качество плохое, исключаем результаты
if (!analysisResult.suitable_for_analysis) {
  console.log('Selfie image quality is poor, excluding from results');
    // Устанавливаем все стилистические параметры в null
    analysisResult.color_temperature = null;
    analysisResult.color_season = null;
    analysisResult.contrast_level = null;
    analysisResult.face_shape = null;
    analysisResult.hair_color = null;
}

// Сохраняем результаты
return {
  json: {
    ...item.json,
    selfie_analysis: analysisResult,
    selfie_quality_score: analysisResult.quality_score || 0,
    selfie_face_visible: analysisResult.face_visible || false,
    selfie_suitable: analysisResult.suitable_for_analysis || false,
    // Стилистические параметры (могут быть null если качество плохое)
    // Примечание: archetype НЕ определяется в selfie, только в fullbody (по позе)
    selfie_color_temperature: analysisResult.color_temperature,
    selfie_color_season: analysisResult.color_season,
    selfie_contrast_level: analysisResult.contrast_level,
    selfie_face_shape: analysisResult.face_shape,
    selfie_hair_color: analysisResult.hair_color,
  },
  binary: item.binary,
};
```

**Функция:**
- Парсит JSON ответ от OpenAI
- Валидирует структуру данных
- Исключает результаты, если `suitable_for_analysis = false`
- Сохраняет все параметры для дальнейшей обработки

**Подключение**:
- Вход: Шаг 25 (OpenAI - Анализ selfie)
- Выход: Шаг 28 (Merge6)

---

## Шаг 27: OpenAI - Анализ fullbody (тело)

**Тип ноды**: OpenAI (LangChain)  
**Название**: "Analyze follbody" (исправить на "Analyze fullbody")  
**Resource**: Image  
**Operation**: Analyze  
**Model**: `chatgpt-4o-latest` (GPT-4.0 Latest)

**Настройки:**
- **Input Type**: Image URL или Binary
- **Image**: `{{ $json.fullbody_url }}` (URL изображения)
- **Temperature**: 0.3-0.5
- **Max Tokens**: 1000
- **Response Format**: JSON Object (JSON mode)

**Промпт для GPT-4.0:**

```
Ты — эксперт мирового уровня в визуальной колористике, стилистике, антропометрии и аналитике юнгианских архетипов.

ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ:
- Возраст: {{ $json.body.age }}
- Пол: {{ $json.body.gender }}

ТВОЯ ЗАДАЧА:
Проанализировать ПОЛНОРОСТОВОЕ фото (fullbody) и определить качество изображения тела и силуэт тела. Верни результат строго в формате JSON.

АНАЛИЗ КАЧЕСТВА ИЗОБРАЖЕНИЯ:
Оцени качество изображения тела (0-100) и определи, видно ли тело четко. Если quality_score < 50 ИЛИ body_visible = false, то suitable_for_analysis = false.

АНАЛИЗ ТЕЛА И ПОЗЫ (только если suitable_for_analysis = true):
Анализируй пропорции тела и позу: соотношение плеч, талии, бедер, осанку, стиль одежды, невербальное выражение.

ПАРАМЕТРЫ ДЛЯ ОПРЕДЕЛЕНИЯ:

1. body_silhouette: Силуэт тела по международной классификации
   - Допустимые значения (выбери ОДИН): "V" | "A" | "H" | "X" | "O" | "I"
   - V: широкие плечи, узкая талия (перевернутый треугольник)
   - A: узкие плечи, широкие бедра (треугольник)
   - H: прямые пропорции (прямоугольник)
   - X: широкие плечи и бедра, узкая талия (песочные часы)
   - O: округлые формы, широкий торс
   - I: очень худощавое, прямые линии

2. archetype: Архетип по позе, осанке, стилю одежды и невербальному выражению 
   - Допустимые значения (выбери ОДИН): "rebel" | "lover" | "explorer" | "creator" | "ruler" | "sage"
   - rebel: бунтарская поза, смелый стиль, неформальная одежда
   - lover: романтичная поза, мягкие линии, элегантный стиль
   - explorer: активная поза, практичная одежда, динамика
   - creator: творческая поза, уникальный стиль, самовыражение
   - ruler: уверенная поза, формальный стиль, авторитетность
   - sage: спокойная поза, классический стиль, мудрость

ВАЖНО:
- Основной фокус: body_silhouette и archetype (определяется по позе лучше, чем по селфи)
- Если suitable_for_analysis = false, верни null для всех параметров

СТРУКТУРА JSON ОТВЕТА:
{
  "quality_score": 0-100,
  "body_visible": true/false,
  "suitable_for_analysis": true/false,
  "body_silhouette": "V" | "A" | "H" | "X" | "O" | "I" | null,
  "archetype": "rebel" | "lover" | "explorer" | "creator" | "ruler" | "sage" | null
}

Верни результат как валидный JSON объект.
```

**Выходные данные:**
- JSON объект с результатами анализа (в `choices[0].message.content`)

**Подключение**:
- Вход: Шаг 24 (Merge5)
- Выход: Шаг 28 (Code - Парсинг результатов fullbody)

---

## Шаг 28: Code - Парсинг результатов fullbody

**Тип ноды**: Code  
**Название**: (создать новую ноду)  
**Файл**: `funel_new/n8n/24-parse-fullbody-analysis.js`

**Код:**
```javascript
const item = $input.item;

// Получаем ответ от OpenAI
const content = item.json.choices?.[0]?.message?.content;

if (!content) {
  throw new Error('No content in OpenAI response for fullbody analysis');
}

// Парсим JSON
let analysisResult;
try {
  analysisResult = typeof content === 'string' ? JSON.parse(content) : content;
} catch (error) {
  throw new Error(`Failed to parse fullbody analysis result: ${error.message}`);
}

// Валидация: проверяем, что suitable_for_analysis определен
if (analysisResult.suitable_for_analysis === undefined) {
  console.warn('suitable_for_analysis not found in response, defaulting to false');
  analysisResult.suitable_for_analysis = false;
}

// Проверка качества: если quality_score < 50 или body_visible = false, исключаем результаты
if (analysisResult.quality_score !== undefined) {
  if (analysisResult.quality_score < 50) {
    console.log(`Fullbody quality_score is ${analysisResult.quality_score} (< 50), marking as unsuitable`);
    analysisResult.suitable_for_analysis = false;
  }
}

if (analysisResult.body_visible === false) {
  console.log('Fullbody body_visible is false, marking as unsuitable');
  analysisResult.suitable_for_analysis = false;
}

// Если качество плохое, исключаем результаты
if (!analysisResult.suitable_for_analysis) {
  console.log('Fullbody image quality is poor, excluding from results');
  // Устанавливаем все параметры в null
  analysisResult.body_silhouette = null;
  analysisResult.archetype = null;
} else {
  console.log('Fullbody image quality is good, using results');
}

// Валидация допустимых значений
const validBodySilhouettes = ['V', 'A', 'H', 'X', 'O', 'I'];
const validArchetypes = ['rebel', 'lover', 'explorer', 'creator', 'ruler', 'sage'];

// Валидация body_silhouette
if (analysisResult.body_silhouette && !validBodySilhouettes.includes(analysisResult.body_silhouette)) {
  console.warn(`Invalid body_silhouette: ${analysisResult.body_silhouette}, setting to null`);
  analysisResult.body_silhouette = null;
}

// Валидация archetype
if (analysisResult.archetype && !validArchetypes.includes(analysisResult.archetype)) {
  console.warn(`Invalid archetype: ${analysisResult.archetype}, setting to null`);
  analysisResult.archetype = null;
}

// Сохраняем результаты
return {
  json: {
    ...item.json,
    fullbody_analysis: analysisResult,
    fullbody_quality_score: analysisResult.quality_score || 0,
    fullbody_body_visible: analysisResult.body_visible || false,
    fullbody_suitable: analysisResult.suitable_for_analysis || false,
    // Параметры (могут быть null если качество плохое)
    fullbody_body_silhouette: analysisResult.body_silhouette || null,
    fullbody_archetype: analysisResult.archetype || null, // Определяется по позе (приоритет перед selfie)
  },
  binary: item.binary,
};
```

**Функция:**
- Парсит JSON ответ от OpenAI
- Валидирует структуру данных
- Исключает результаты, если `suitable_for_analysis = false`
- Сохраняет `body_silhouette` и опциональный `color_season`

**Подключение**:
- Вход: Шаг 27 (OpenAI - Анализ fullbody)
- Выход: Шаг 28 (Merge6)

---

## Шаг 29: Merge - Объединение результатов анализа

**Тип ноды**: Merge  
**Название**: "Merge6"

**Настройки:**
- **Mode**: Merge By Index
- **Merge**: All Inputs

**Функция**: Объединяет результаты анализа selfie и fullbody для суммирования и выбора лучшего изображения.

**Подключение**:
- Вход 1: Шаг 26 (Code - Парсинг результатов selfie)
- Вход 2: Шаг 28 (Code - Парсинг результатов fullbody)
- Выход: Шаг 30 (Code - Суммирование и выбор лучшего)

---

## Шаг 30: Code - Суммирование и выбор лучшего изображения

**Тип ноды**: Code  
**Название**: "Суммирование и выбор лучшего"  
**Файл**: `funel_new/n8n/26-summarize-and-select-best.js`

**Функция:**
- Выбирает лучшее изображение (selfie или fullbody) на основе качества
- Суммирует все результаты анализа
- Формирует финальные параметры (color_temperature, color_season, contrast_level, face_shape, body_silhouette, hair_color, archetype)
- Создает `result_link` через Set для уникальности параметров
- Формирует данные для обновления Supabase, отправки в Telegram и React

**Логика выбора:**
1. Приоритет 1: `suitable_for_analysis` (подходит ли для анализа)
2. Приоритет 2: Видимость (face_visible для selfie, body_visible для fullbody)
3. Приоритет 3: `quality_score` (общий рейтинг качества)
4. По умолчанию: fullbody (так как там есть body_silhouette и archetype)

**Выходные данные:**
- `selected_image_type`, `selected_image_url`, `selected_image_quality_score`, `selection_reason`
- Финальные параметры анализа: `color_temperature`, `color_season`, `contrast_level`, `face_shape`, `body_silhouette`, `hair_color`, `archetype`
- `result_link` - URL с параметрами (создан через Set для уникальности)
- `webhook_data` - данные для отправки в React
- `telegram_data` - данные для отправки в Telegram
- `session_db_id` - для обновления Supabase

**Подключение**:
- Вход: Шаг 29 (Merge6)
- Выход: Шаг 31 (Supabase - Обновление сессии)

---

## Шаг 31: Supabase - Обновление сессии с результатами анализа

**Тип ноды**: Supabase  
**Название**: "Обновление сессии с результатами"

**Настройки:**
- **Operation**: Update
- **Table**: `sessions`
- **Credential**: VIBELOOK

**Select Conditions:**
- **Field**: `id`
- **Condition**: Equals
- **Value**: `{{ $json.session_db_id || $json.id }}`

**Fields to Update:**
- `color_temperature`: `{{ $json.color_temperature }}`
- `color_season`: `{{ $json.color_season }}`
- `contrast_level`: `{{ $json.contrast_level }}`
- `face_shape`: `{{ $json.face_shape }}`
- `body_silhouette`: `{{ $json.body_silhouette }}`
- `hair_color`: `{{ $json.hair_color }}`
- `archetype`: `{{ $json.archetype }}`

**Options:**
- **Return All**: ON
- **Continue On Fail**: ON

**Функция**: Обновляет запись сессии с результатами анализа.

**Подключение**:
- Вход: Шаг 30 (Code - Суммирование и выбор лучшего)
- Выход: Шаг 32 (HTTP Request - Отправка в Telegram) и Шаг 33 (HTTP Request - Webhook в React)

---

## Шаг 32: HTTP Request - Отправка в Telegram

**Тип ноды**: HTTP Request  
**Название**: "Отправка в Telegram"

**Настройки:**
- **Method**: POST
- **URL**: `https://api.telegram.org/bot{{ $env.TELEGRAM_BOT_TOKEN }}/sendMessage`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{{ $json.telegram_data }}
```

Или вручную:
```json
{
  "chat_id": "{{ $json.tg_user_id }}",
  "text": "Ваш анализ готов! Перейдите по ссылке: {{ $json.result_link }}",
  "parse_mode": "HTML"
}
```

**Options:**
- **Follow Redirect**: true
- **Timeout**: 30000
- **Continue On Fail**: ON

**Функция**: Отправляет сообщение в Telegram с ссылкой на результаты анализа.

**Примечание**: 
- `TELEGRAM_BOT_TOKEN` должен быть установлен как переменная окружения в n8n
- Если `tg_user_id` отсутствует, нода пропускается (Continue On Fail: ON)

**Подключение**:
- Вход: Шаг 31 (Supabase - Обновление сессии)
- Выход: Конец workflow (параллельно с шагом 33)

---

## Шаг 33: HTTP Request - Webhook callback в React

**Тип ноды**: HTTP Request  
**Название**: "Webhook callback в React"

**Настройки:**
- **Method**: POST
- **URL**: `https://funelnew.vercel.app/api/webhook/callback`

**Headers:**
```
Content-Type: application/json
X-Webhook-Secret: {{ $env.WEBHOOK_SECRET }}
```

**Body (JSON):**
```json
{{ $json.webhook_data }}
```

Или вручную:
```json
{
  "session_id": "{{ $json.session_id }}",
  "status": "completed",
  "result_url": "{{ $json.result_link }}",
  "analysis": {
    "color_temperature": "{{ $json.color_temperature }}",
    "color_season": "{{ $json.color_season }}",
    "contrast_level": "{{ $json.contrast_level }}",
    "face_shape": "{{ $json.face_shape }}",
    "body_silhouette": "{{ $json.body_silhouette }}",
    "hair_color": "{{ $json.hair_color }}",
    "archetype": "{{ $json.archetype }}"
  },
  "user_id": "{{ $json.user_id }}",
  "tg_user_id": "{{ $json.tg_user_id }}",
  "first_name": "{{ $json.first_name }}",
  "name": "{{ $json.first_name }}"
}
```

**Примечание**: 
- Параметр `name` в URL используется для отображения в заголовке страницы результатов
- Значение берется из `first_name` пользователя
- Если `first_name` не указан, параметр `name` не добавляется в URL

**Options:**
- **Follow Redirect**: true
- **Timeout**: 30000
- **Continue On Fail**: ON

**Функция**: Отправляет webhook callback в React приложение с результатами анализа.

**Подключение**:
- Вход: Шаг 31 (Supabase - Обновление сессии)
- Выход: Конец workflow (параллельно с шагом 32)

---

## Схема подключения нод

```
1. Webhook → 2. Парсинг → 3. Merge
                    ↓
            4. Поиск пользователя → 3. Merge → 5. Проверка результата → 6. IF
                                                                    ↓
                                                            7. Создание пользователя
                                                                    ↓
8. Объединение результатов пользователя → 9. Подсчет сессий → 10. Подсчет сессий → 11. IF1
                                                                                ↓
2. Парсинг → 12. Merge1 → 13. Загрузка selfie → 14. Формирование selfie_url → 17. Merge2
                    ↓
            15. Загрузка fullbody → 16. Формирование fullbody_url → 17. Merge2
                                                                        ↓
8. Объединение результатов пользователя → 18. Merge3 → 19. Попытка обновления сессии → 20. Проверка результата → 21. IF2
                                                                                                    ↓
                                                                                            22. Создание сессии
                                                                                                    ↓
23. Объединение результатов сессии → 24. Merge5 → 25. Анализ selfie → 26. Парсинг selfie → 29. Merge6
                                            ↓
                                    27. Анализ fullbody → 28. Парсинг fullbody → 29. Merge6
                                                                                    ↓
30. Суммирование и выбор лучшего → 31. Обновление сессии → 32. Отправка в Telegram (параллельно) → 33. Webhook callback в React (параллельно)
```

---

## Переменные окружения

Убедитесь, что в n8n настроены следующие переменные окружения:

- `WEBHOOK_SECRET` - Секретный ключ для webhook (опционально)
- `TELEGRAM_BOT_TOKEN` - Токен Telegram бота для отправки сообщений (опционально)

**Credentials:**
- **VIBELOOK** - Supabase API credential (должен быть настроен)
- **OpenAi account** - OpenAI API credential (должен быть настроен)

---

## Troubleshooting

### Проблема: OpenAI возвращает неправильную структуру JSON

**Решение:**
- Убедитесь, что включен JSON mode (response_format: "json_object")
- Проверьте, что промпт начинается с инструкции возвращать JSON
- Убедитесь, что все допустимые значения явно перечислены в промпте

### Проблема: Качество изображения плохое, но результаты все равно используются

**Решение:**
- Проверьте, что в промптах есть четкая инструкция: "Если quality_score < 50 ИЛИ face_visible/body_visible = false, то suitable_for_analysis = false"
- Проверьте ноды парсинга (шаги 26 и 28), что они правильно исключают результаты при `suitable_for_analysis = false`

### Проблема: body_silhouette не определяется

**Решение:**
- Убедитесь, что fullbody изображение анализируется (шаг 27)
- Проверьте, что в промпте для fullbody основной фокус на body_silhouette
- Проверьте ноду выбора лучшего изображения (шаг 30), что она правильно берет body_silhouette из fullbody анализа

### Проблема: color_season определяется неправильно (не из 12 вариантов)

**Решение:**
- Убедитесь, что в промптах явно перечислены все 12 цветотипов
- Проверьте, что промпт содержит инструкцию: "НЕ используй общие сезоны (winter, spring, summer, autumn)"
- Добавьте валидацию в ноды парсинга (шаги 26 и 28)

---

## Важные замечания

1. **GPT-4.0 Latest ограничения:**
   - Максимальная длина контекста: ~128K токенов
   - Используйте JSON mode для структурированного вывода
   - Temperature: 0.3-0.5 для детерминированных результатов
   - Max Tokens: 1000 для анализа изображений

2. **Разделение анализа:**
   - Selfie анализирует только лицо (кожа, волосы, глаза, форма лица, архетип)
   - Fullbody анализирует только тело (силуэт, пропорции)
   - Если качество плохое → результаты исключаются

3. **Исключение результатов при плохом качестве:**
   - Если `quality_score < 50` ИЛИ `face_visible/body_visible = false` → `suitable_for_analysis = false`
   - При `suitable_for_analysis = false` все стилистические параметры = null
   - Нода выбора лучшего изображения использует только изображения с `suitable_for_analysis = true`

4. **Валидация параметров:**
   - Все параметры должны строго соответствовать типам из `funel_new/types/result.ts`
   - Архетипы: только rebel, lover, explorer, creator, ruler, sage
   - Цветотипы: только 12 точных вариантов (bright_winter, cool_winter, и т.д.)

