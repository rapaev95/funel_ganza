# HTTP Request ноды для работы с Supabase

Все HTTP Request ноды должны использовать credential "vibelook" (Supabase API).

## Нода 1: HTTP Request - Поиск пользователя

**Тип**: HTTP Request  
**Method**: GET  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/users?tg_user_id=eq.{{ $json.tg_user_id }}&select=id,first_name,tg_user_id
```

**Authentication**: Supabase API  
**Credential**: vibelook

**Send Headers**: ON  
**Headers**:
```
Content-Type: application/json
```

## Нода 2: Merge - Объединение данных

**Тип**: Merge  
**Mode**: Merge By Index  
**Merge**: All Inputs

Это объединит результат HTTP Request с исходными данными из парсинга.

## Нода 3: Code - Проверка результата поиска пользователя

**Тип**: Code  
**Файл**: `02-check-user-search-result.js`

Скопируйте код из файла `02-check-user-search-result.js` в Code ноду (без markdown разметки, только чистый JavaScript).

## Нода 4: IF - Проверка should_create_user

**Тип**: IF  
**Condition**: `{{ $json.should_create_user === true }}`

**True**: переходим к созданию пользователя  
**False**: пропускаем создание (пользователь уже найден), данные передаются дальше

## Нода 5: HTTP Request - Создание пользователя

**Тип**: HTTP Request  
**Method**: POST  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/users
```

**Authentication**: Supabase API  
**Credential**: vibelook

**Send Headers**: ON  
**Headers**:
```
Content-Type: application/json
Prefer: return=representation
```

**Send Body**: ON  
**Body Content Type**: JSON  
**Body**:
```json
{
  "tg_user_id": "{{ $json.tg_user_id }}",
  "first_name": "{{ $json.first_name }}",
  "language": "ru"
}
```

## Нода 6: Code - Объединение результатов пользователя

**Тип**: Code  
**Файл**: `04-merge-user-results.js`

Скопируйте код из файла `04-merge-user-results.js` в Code ноду (без markdown разметки, только чистый JavaScript).

## Нода 7: HTTP Request - Подсчет сессий пользователя

**Тип**: HTTP Request  
**Method**: GET  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/sessions?user_id=eq.{{ $json.user_id }}&select=id
```

**Authentication**: Supabase API  
**Credential**: vibelook

**Send Headers**: ON  
**Headers**:
```
Content-Type: application/json
```

## Нода 8: Code - Подсчет сессий и проверка лимита

**Тип**: Code  
**Файл**: `08-count-sessions-and-limit.js`

Скопируйте код из файла `08-count-sessions-and-limit.js` в Code ноду (без markdown разметки, только чистый JavaScript).

## Нода 9: HTTP Request - Проверка существования сессии

**Тип**: HTTP Request  
**Method**: GET  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/sessions?session_id=eq.{{ $json.session_id }}&select=id
```

**Authentication**: Supabase API  
**Credential**: vibelook

**Send Headers**: ON  
**Headers**:
```
Content-Type: application/json
```

## Нода 10: Code - Проверка сессии и лимита

**Тип**: Code  
**Файл**: `10-check-session-and-limit.js`

Скопируйте код из файла `10-check-session-and-limit.js` в Code ноду (без markdown разметки, только чистый JavaScript).

## Нода 11: IF - Проверка лимита

**Тип**: IF  
**Condition**: `{{ $json.limit_exceeded === false }}`  
**True**: продолжаем выполнение  
**False**: останавливаем workflow (лимит превышен)

## Нода 13: HTTP Request - Загрузка selfie в Storage

**Тип**: HTTP Request  
**Method**: POST  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/storage/v1/object/foto_client/user_images/{{ $json.user_id }}/session_{{ $json.session_id }}/selfie.jpg
```

**Authentication**: Supabase API  
**Credential**: vibelook

**Send Headers**: ON  
**Headers**:
```
Content-Type: {{ $binary.image_1.mimeType || "image/jpeg" }}
x-upsert: true
```

**Примечание**: Credential "vibelook" автоматически добавит заголовки `Authorization` и `apikey`. Не добавляйте их вручную.

**Send Body**: ON  
**Body Content Type**: Binary Data  
**Binary Property**: `image_1`

**Options**:
- Follow Redirect: true
- Timeout: 30000

**Примечание**: Binary данные должны быть доступны как `$binary.image_1` из исходного webhook.

## Нода 14: Code - Формирование selfie_url

**Тип**: Code  
**Файл**: `03-format-selfie-url.js`

Скопируйте код из файла `03-format-selfie-url.js` в Code ноду (без markdown разметки, только чистый JavaScript).

## Нода 15: HTTP Request - Загрузка fullbody в Storage

**Тип**: HTTP Request  
**Method**: POST  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/storage/v1/object/foto_client/user_images/{{ $json.user_id }}/session_{{ $json.session_id }}/fullbody.jpg
```

**Authentication**: Supabase API  
**Credential**: vibelook

**Send Headers**: ON  
**Headers**:
```
Content-Type: {{ $binary.image_2.mimeType || "image/jpeg" }}
x-upsert: true
```

**Примечание**: Credential "vibelook" автоматически добавит заголовки `Authorization` и `apikey`. Не добавляйте их вручную.

**Send Body**: ON  
**Body Content Type**: Binary Data  
**Binary Property**: `image_2`

**Options**:
- Follow Redirect: true
- Timeout: 30000

**Примечание**: Binary данные должны быть доступны как `$binary.image_2` из исходного webhook.

## Нода 16: Code - Формирование fullbody_url

**Тип**: Code  
**Файл**: `05-format-fullbody-url.js`

Скопируйте код из файла `05-format-fullbody-url.js` в Code ноду (без markdown разметки, только чистый JavaScript).

## Нода 17: Code - Объединение URL

**Тип**: Code  
**Файл**: `06-merge-urls.js`

Скопируйте код из файла `06-merge-urls.js` в Code ноду (без markdown разметки, только чистый JavaScript).

Эта нода объединяет `selfie_url` и `fullbody_url` из предыдущих нод.

## Нода 17.5: Merge3 - Объединение данных для создания сессии

**ВАЖНО**: Эта Merge нода (Merge3) критически важна! Она должна объединять данные из ТРЕХ источников:

**Тип**: Merge  
**Mode**: Merge By Index (или Append)  
**Merge**: All Inputs

**Подключите к Merge3 ноде:**
- **Вход 1**: из ноды 7 (Code - Объединение результатов пользователя) — содержит `user_id` (UUID) ⚠️ **ОБЯЗАТЕЛЬНО!**
- **Вход 2**: из Merge2 (который объединяет selfie и fullbody URLs) — содержит `selfie_url`, `fullbody_url`
- **Вход 3** (опционально): из ноды парсинга — содержит `session_id`, `tg_user_id` и другие данные

**Почему это важно:**
- Нода 7 возвращает `user_id` (UUID) после поиска/создания пользователя — **БЕЗ ЭТОГО НЕ РАБОТАЕТ!**
- Merge2 возвращает `selfie_url` и `fullbody_url` после загрузки изображений
- Merge3 объединяет все эти данные, чтобы все поля были доступны для создания сессии

**Проверка:**
После Merge3 ноды должны быть доступны во всех элементах массива:
- `user_id` (UUID) — из ноды 7 ⚠️ **ДОЛЖЕН БЫТЬ!**
- `session_id` — из ноды парсинга или ноды 7
- `selfie_url` — из Merge2
- `fullbody_url` — из Merge2
- Все остальные данные (age, gender, UTM и т.д.)

**Если `user_id` не найден:**
- Проверьте, что нода 7 подключена к Merge3
- Проверьте, что нода 7 возвращает `user_id` (UUID) в поле `user_id`
- Проверьте логи выполнения ноды 7, чтобы убедиться, что она возвращает правильные данные

## Нода 18: Supabase - Попытка обновления сессии

**Тип**: Supabase  
**Operation**: Update  
**Table**: `sessions`  
**Credential**: vibelook

**Update Key**: `session_id`  
**Update Key Value**: `{{ $json.session_id }}`

**Fields to Update**:
- `user_id`: `{{ $json.user_id }}`
- `session_id`: `{{ $json.session_id }}`
- `image_count`: `{{ $json.image_count || 2 }}`
- `age`: `{{ $json.age }}`
- `gender`: `{{ $json.gender }}`
- `budget_preference`: `{{ $json.budget_preference }}`
- `selfie_url`: `{{ $json.selfie_url }}`
- `fullbody_url`: `{{ $json.fullbody_url }}`
- `utm_source`: `{{ $json.utm_source }}`
- `utm_medium`: `{{ $json.utm_medium }}`
- `utm_campaign`: `{{ $json.utm_campaign }}`
- `utm_content`: `{{ $json.utm_content }}`
- `utm_term`: `{{ $json.utm_term }}`
- `fbclid`: `{{ $json.fbclid }}`

**Options**:
- Return All: ON (чтобы получить обновленную запись)

**Continue On Fail**: ON (чтобы не останавливать workflow, если сессия не найдена)

**Примечание**: См. подробные инструкции в `18-update-session-supabase.md`

## Нода 19: Code - Проверка результата обновления сессии

**Тип**: Code  
**Файл**: `19-check-session-update-result.js`

Скопируйте код из файла `19-check-session-update-result.js` в Code ноду.

## Нода 20: IF - Проверка should_create_session

**Тип**: IF  
**Condition**: `{{ $json.should_create_session === true }}`

**True**: переходим к созданию сессии  
**False**: сессия обновлена, пропускаем создание

## Нода 20.5: Code - Подготовка body для создания сессии

**Тип**: Code  
**Файл**: `20-prepare-session-create-body.js`

Скопируйте код из файла `20-prepare-session-create-body.js` в Code ноду.

Эта нода извлекает все необходимые данные из предыдущих нод и формирует правильный body для создания сессии.

## Нода 21: Supabase - Создание сессии

**Тип**: Supabase  
**Operation**: Insert  
**Table**: `sessions`  
**Credential**: vibelook

**Fields**:
- `user_id`: `{{ $json.user_id }}` (UUID)
- `session_id`: `{{ $json.session_id }}`
- `image_count`: `{{ $json.image_count || 2 }}`
- `age`: `{{ $json.age }}`
- `gender`: `{{ $json.gender }}`
- `budget_preference`: `{{ $json.budget_preference }}`
- `selfie_url`: `{{ $json.selfie_url }}`
- `fullbody_url`: `{{ $json.fullbody_url }}`
- `utm_source`: `{{ $json.utm_source }}`
- `utm_medium`: `{{ $json.utm_medium }}`
- `utm_campaign`: `{{ $json.utm_campaign }}`
- `utm_content`: `{{ $json.utm_content }}`
- `utm_term`: `{{ $json.utm_term }}`
- `fbclid`: `{{ $json.fbclid }}`

**Options**:
- Return All: ON (чтобы получить созданную запись)

**Примечание**: См. подробные инструкции в `21-create-session-supabase.md`

**Альтернатива**: Если используете подготовленный body из ноды 20.5, можно использовать HTTP Request ноду с `{{ $json.request_body }}` в Body.

## Нода 22: Code - Обработка результата создания/обновления сессии

**Тип**: Code  
**Файл**: `22-merge-session-results.js`

Скопируйте код из файла `22-merge-session-results.js` в Code ноду.

Эта нода обрабатывает результат создания или обновления сессии и возвращает данные с `session_db_id`.

## Нода 23: OpenAI - Анализ selfie изображения (лицо)

**Тип**: OpenAI (LangChain)  
**Resource**: Image  
**Operation**: Analyze  
**Credential**: OpenAI API  
**Model**: `chatgpt-4o-latest` (GPT-4.0 Latest)

**Настройки:**
- **Input Type**: Image URL
- **Image**: `{{ $json.selfie_url }}`
- **Temperature**: 0.3-0.5
- **Max Tokens**: 1000
- **Response Format**: JSON Object (JSON mode)

**Промпт:**

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

2. color_season: Определи точный цветотип из 12 вариантов на основе комбинации кожи + волос + глаз
   - Допустимые значения (выбери ОДИН):
     "bright_winter" | "cool_winter" | "deep_winter" |
     "cool_summer" | "light_summer" | "soft_summer" |
     "warm_spring" | "light_spring" | "bright_spring" |
     "warm_autumn" | "soft_autumn" | "deep_autumn"
   - НЕ используй общие сезоны (winter, spring, summer, autumn)

3. contrast_level: "high" | "medium" | "low"

4. face_shape: "oval" | "round" | "square" | "rectangle" | "triangle" | "inverted_triangle" | "diamond"

5. hair_color: "black" | "dark_brown" | "brown" | "light_brown" | "dark_blonde" | "ash_blonde" | "cool_blonde" | "platinum_blonde" | "red" | "copper" | "grey"

ВАЖНО:
- НЕ определяй body_silhouette (тело не видно в селфи)
- НЕ определяй archetype (архетип лучше определяется по позе в fullbody, не в селфи)
- Если suitable_for_analysis = false, верни null для всех стилистических параметров

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

**Примечание**: 
- Эта нода анализирует только лицо (selfie)
- Результат будет в `$json.choices[0].message.content` (JSON строка)
- Используйте файл `23-parse-selfie-analysis.js` для парсинга результатов

## Нода 23.5: Code - Парсинг результатов анализа selfie

**Тип**: Code  
**Файл**: `funel_new/n8n/23-parse-selfie-analysis.js`

Скопируйте код из файла `23-parse-selfie-analysis.js` в Code ноду.

**Функция:**
- Парсит JSON ответ от OpenAI
- Валидирует структуру данных
- Исключает результаты, если `suitable_for_analysis = false` или `quality_score < 50`
- Валидирует все параметры на соответствие допустимым значениям

## Нода 24: OpenAI - Анализ fullbody изображения (тело)

**Тип**: OpenAI (LangChain)  
**Resource**: Image  
**Operation**: Analyze  
**Credential**: OpenAI API  
**Model**: `chatgpt-4o-latest` (GPT-4.0 Latest)

**Настройки:**
- **Input Type**: Image URL
- **Image**: `{{ $json.fullbody_url }}`
- **Temperature**: 0.3-0.5
- **Max Tokens**: 1000
- **Response Format**: JSON Object (JSON mode)

**Промпт:**

```
Ты — эксперт мирового уровня в визуальной колористике, стилистике, антропометрии и аналитике юнгианских архетипов.

ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ:
- Возраст: {{ $json.body.age }}
- Пол: {{ $json.body.gender }}

ТВОЯ ЗАДАЧА:
Проанализировать ПОЛНОРОСТОВОЕ фото (fullbody) и определить качество изображения тела, силуэт тела и архетип по позе. Верни результат строго в формате JSON.

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

2. archetype: Архетип по позе, осанке, стилю одежды и невербальному выражению (ПРИОРИТЕТ: определяется лучше по позе, чем по селфи)
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

**Примечание**: 
- Эта нода анализирует только тело (fullbody)
- Основной параметр: `body_silhouette`
- Результат будет в `$json.choices[0].message.content` (JSON строка)
- Используйте файл `24-parse-fullbody-analysis.js` для парсинга результатов

## Нода 24.5: Code - Парсинг результатов анализа fullbody

**Тип**: Code  
**Файл**: `funel_new/n8n/24-parse-fullbody-analysis.js`

Скопируйте код из файла `24-parse-fullbody-analysis.js` в Code ноду.

**Функция:**
- Парсит JSON ответ от OpenAI
- Валидирует структуру данных
- Исключает результаты, если `suitable_for_analysis = false` или `quality_score < 50`
- Валидирует `body_silhouette` и опциональный `color_season`

**Примечание**: Ноды 23 и 24 могут выполняться параллельно (если n8n поддерживает параллельное выполнение).

## Нода 25: Code - Выбор лучшего изображения

**Тип**: Code  
**Файл**: `funel_new/n8n/25-select-best-image.js`

Скопируйте код из файла `25-select-best-image.js` в Code ноду.

**Подключите к ноде через Merge:**
- Данные из ноды 23.5 (анализ selfie)
- Данные из ноды 24.5 (анализ fullbody)

**Логика выбора:**
1. **Приоритет 1**: Подходит ли изображение для анализа (`suitable_for_analysis = true`)
   - Используются только изображения с `suitable_for_analysis = true`
   - Если оба не подходят → выбирается лучшее по quality_score, но помечается как "low_quality"
2. **Приоритет 2**: Видимость лица (`face_visible`)
3. **Приоритет 3**: Общий рейтинг качества (`quality_score`)
4. **По умолчанию**: выбирается fullbody, если все параметры равны (так как там есть body_silhouette)

**Исключение результатов при плохом качестве:**
- Если `quality_score < 50` ИЛИ `face_visible/body_visible = false` → `suitable_for_analysis = false`
- При `suitable_for_analysis = false` все стилистические параметры = null
- Если выбранное изображение имеет плохое качество → все параметры = null, устанавливается флаг `is_low_quality = true`

**Что возвращает:**
- `selected_image_type`: 'selfie' или 'fullbody'
- `selected_image_url`: URL выбранного изображения
- `selected_image_quality_score`: Рейтинг качества
- `selection_reason`: Причина выбора
- `is_low_quality`: true/false (если оба изображения плохого качества)
- Стилистические параметры:
  - Из выбранного изображения: `color_temperature`, `color_season`, `contrast_level`, `face_shape`, `hair_color`
  - Из fullbody (если доступно): `body_silhouette`, `archetype` (приоритет: определяется по позе в fullbody, не в selfie)

**Важно**: 
- Если выбрано selfie, но есть fullbody анализ с хорошим качеством - `body_silhouette` и `archetype` берутся из fullbody анализа
- Если выбрано fullbody - все параметры берутся из fullbody анализа
- `archetype` определяется ТОЛЬКО в fullbody (по позе), НЕ в selfie
- Если оба изображения плохого качества - используется лучшее, но все параметры = null

## Полный порядок нод:

1. Webhook - Прием данных из React
2. Code - Парсинг данных (`01-parse-data.js`)
3. HTTP Request - Поиск пользователя
4. Merge - Объединение данных (объединяет результат поиска с исходными данными)
5. Code - Проверка результата поиска (`02-check-user-search-result.js`)
6. IF - should_create_user (`{{ $json.should_create_user === true }}`)
   - **True** → HTTP Request - Создание пользователя
   - **False** → пропускаем создание
7. Code - Объединение результатов пользователя (`04-merge-user-results.js`)
8. HTTP Request - Подсчет сессий пользователя
9. Code - Подсчет сессий и проверка лимита (`08-count-sessions-and-limit.js`)
10. HTTP Request - Проверка существования сессии
11. Code - Проверка сессии и лимита (`10-check-session-and-limit.js`)
12. IF - Проверка лимита (`{{ $json.limit_exceeded === false }}`)
    - **True** → продолжаем
    - **False** → останавливаем workflow
13. HTTP Request - Загрузка selfie в Storage
14. Code - Формирование selfie_url (`03-format-selfie-url.js`)
15. HTTP Request - Загрузка fullbody в Storage
16. Code - Формирование fullbody_url (`05-format-fullbody-url.js`)
17. Code - Объединение URL (`06-merge-urls.js`)
17.5. **Merge - Объединение данных для создания сессии** (объединяет данные из ноды 7 и ноды 17)
18. Supabase - Попытка обновления сессии (Update operation)
19. Code - Проверка результата обновления (`19-check-session-update-result.js`)
20. IF - should_create_session (`{{ $json.should_create_session === true }}`)
    - **True** → Code - Подготовка body → Supabase - Создание сессии (Insert)
    - **False** → пропускаем создание
20.5. Code - Подготовка body для создания сессии (`20-prepare-session-create-body.js`) - только если нужно
21. Supabase - Создание сессии (Insert operation) - только если нужно
22. Code - Обработка результата создания/обновления сессии (`22-merge-session-results.js`)
23. OpenAI - Анализ selfie (готовые ноды OpenAI)
23.5. Code - Парсинг результатов анализа selfie (`23-parse-selfie-analysis.js`)
24. OpenAI - Анализ fullbody (готовые ноды OpenAI)
24.5. Code - Парсинг результатов анализа fullbody (`24-parse-fullbody-analysis.js`)
25. Merge - Объединение результатов анализа (объединяет результаты нод 23.5 и 24.5)
26. Code - Суммирование и выбор лучшего (`26-summarize-and-select-best.js`) - выбирает лучшее изображение, суммирует результаты, создает result_link через Set
27. Supabase - Обновление сессии с результатами анализа
28. HTTP Request - Отправка в Telegram (параллельно с нодой 29)
29. HTTP Request - Webhook callback в React (параллельно с нодой 28)

## Нода 27: Code - Суммирование результатов анализа

**Тип**: Code  
**Файл**: `27-summarize-analysis-results.js`

Скопируйте код из файла `27-summarize-analysis-results.js` в Code ноду.

Эта нода объединяет все результаты анализа в единую структуру для дальнейшей обработки.

## Нода 27.5: Supabase - Обновление сессии с результатами анализа (опционально)

**Тип**: Supabase  
**Operation**: Update  
**Table**: `sessions`  
**Credential**: vibelook

**Select Conditions**:
- **Field Name or ID**: `id`
- **Condition**: **Equals**
- **Field Value**: `{{ $json.session_db_id || $json.id }}`

**Fields to Update**:
- `color_temperature`: `{{ $json.color_temperature }}`
- `color_season`: `{{ $json.color_season }}`
- `contrast_level`: `{{ $json.contrast_level }}`
- `face_shape`: `{{ $json.face_shape }}`
- `body_silhouette`: `{{ $json.body_silhouette }}`
- `hair_color`: `{{ $json.hair_color }}`
- `archetype`: `{{ $json.archetype }}`

**Options**:
- Return All: ON

**Примечание**: См. подробные инструкции в `27-update-session-with-analysis.md`

Эта нода обновляет запись в таблице `sessions` с результатами анализа.

## Нода 28: HTTP Request - Отправка в Telegram

**Тип**: HTTP Request  
**Method**: POST  
**URL**: `https://api.telegram.org/bot{{ $env.TELEGRAM_BOT_TOKEN }}/sendMessage`

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

**Примечание**: 
- `TELEGRAM_BOT_TOKEN` должен быть установлен как переменная окружения в n8n
- Если `tg_user_id` отсутствует, нода пропускается (Continue On Fail: ON)
- Эта нода может выполняться параллельно с нодой 29

## Нода 29: HTTP Request - Webhook callback в React

**Тип**: HTTP Request  
**Method**: POST  
**URL**: `https://funelnew.vercel.app/api/webhook/callback`

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

**Options:**
- **Follow Redirect**: true
- **Timeout**: 30000
- **Continue On Fail**: ON

**Примечание**: 
- Эта нода может выполняться параллельно с нодой 28 (отправка в Telegram)
- `WEBHOOK_SECRET` должен быть установлен как переменная окружения в n8n (опционально)
- Параметр `name` в URL (`result_url`) используется для отображения в заголовке страницы результатов
- Значение `name` берется из `first_name` пользователя
- Если `first_name` не указан, параметр `name` не добавляется в URL

## Нода 30: HTTP Request - Webhook callback в React/Next.js

**Тип**: HTTP Request  
**Method**: POST  
**URL**: `https://funelnew.vercel.app/api/webhook/callback`

**Send Body**: ON  
**Body Content Type**: JSON  
**Body**: 
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
    "body_silhouette": "{{ $json.final_body_type || $json.body_silhouette }}",
    "hair_color": "{{ $json.hair_color }}",
    "archetype": "{{ $json.archetype }}"
  },
  "user_id": "{{ $json.user_id }}",
  "tg_user_id": "{{ $json.tg_user_id }}",
  "first_name": "{{ $json.first_name }}",
  "name": "{{ $json.first_name }}"
}
```

**Options**:
- Follow Redirect: true
- Timeout: 30000

**Continue On Fail**: ON

**Примечание**: См. подробные инструкции в `30-send-webhook-to-react.md`

**Важно**: 
- Merge нода (нода 4) необходима, чтобы сохранить исходные данные из парсинга вместе с результатом HTTP Request
- Нода 7 (Объединение результатов пользователя) должна получать данные из обеих веток IF ноды (True и False)
- Нода 22 (Объединение результатов сессии) должна получать данные из обеих веток IF ноды (True и False) через Merge ноду
- Ноды 23 и 24 могут выполняться параллельно (анализ качества обоих изображений)
- Ноды 23 и 24 выполняются параллельно (анализ обоих изображений с разными промптами)
- Нода 25 объединяет результаты нод 23.5 и 24.5 через Merge для выбора лучшего изображения
- Нода 25 уже содержит все стилистические параметры из выбранного изображения (не нужна отдельная нода для стилистического анализа)
- Нода 28 определяет финальный тип фигуры
- Нода 29 формирует webhook ссылку и данные для отправки
- Нода 30 отправляет webhook в React/Next.js приложение

