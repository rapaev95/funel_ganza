# Supabase нода - Создание сессии (INSERT)

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

## Нода 22: Code - Обработка результата создания сессии

**Тип**: Code  
**Файл**: `22-merge-session-results.js`

Скопируйте код из файла `22-merge-session-results.js` в Code ноду.

Эта нода обрабатывает результат создания сессии и возвращает данные с `session_db_id`.


