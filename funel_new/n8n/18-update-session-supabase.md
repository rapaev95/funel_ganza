# Supabase нода - Обновление сессии (PATCH)

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

## Нода 19: Code - Проверка результата обновления сессии

**Тип**: Code  
**Файл**: `19-check-session-update-result.js`

Скопируйте код из файла `19-check-session-update-result.js` в Code ноду.

Эта нода проверяет, была ли сессия обновлена. Если нет - устанавливает флаг `should_create_session: true`.


