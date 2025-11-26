# HTTP Request - Создание сессии в таблице sessions

## Настройки ноды

**Тип**: HTTP Request  
**Method**: POST  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/sessions
```

**Authentication**: Supabase API (VIBELOOK) или Generic Credential Type

**Send Headers**: ON

**Headers**:
```
Content-Type: application/json
Prefer: return=representation
```

**Send Body**: ON  
**Body Content Type**: JSON

**Body** (JSON):
```json
{
  "user_id": "{{ $json.user_id }}",
  "session_id": "{{ $json.session_id }}",
  "image_count": {{ $json.image_count || 2 }},
  "age": "{{ $json.age }}",
  "gender": "{{ $json.gender }}",
  "budget_preference": "{{ $json.budget_preference }}",
  "selfie_url": "{{ $json.selfie_url }}",
  "fullbody_url": "{{ $json.fullbody_url }}",
  "utm_source": "{{ $json.utm_source || null }}",
  "utm_medium": "{{ $json.utm_medium || null }}",
  "utm_campaign": "{{ $json.utm_campaign || null }}",
  "utm_content": "{{ $json.utm_content || null }}",
  "utm_term": "{{ $json.utm_term || null }}",
  "fbclid": "{{ $json.fbclid || null }}"
}
```

## Важные замечания

- `user_id` должен быть UUID (из предыдущей ноды поиска/создания пользователя)
- `session_id` - строка из webhook
- Все UTM параметры могут быть null
- `selfie_url` и `fullbody_url` должны быть заполнены из предыдущих нод

## Альтернативный вариант через Code ноду

Если HTTP Request не работает, можно использовать Code ноду (см. `08-create-session-code.js`)


