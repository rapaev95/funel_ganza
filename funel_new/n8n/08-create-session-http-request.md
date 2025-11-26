# HTTP Request - Создание/обновление сессии (UPSERT)

## Вариант 1: Использовать HTTP Request ноду с PATCH (рекомендуется)

**Тип**: HTTP Request  
**Method**: PATCH  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/sessions?session_id=eq.{{ $json.session_id }}
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

**Проблема**: PATCH не создаст запись, если её нет. Нужна логика UPSERT.

## Вариант 2: Code нода с проверкой и двумя HTTP Request нодами

### Нода 1: HTTP Request - Попытка обновления (PATCH)

**Тип**: HTTP Request  
**Method**: PATCH  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/sessions?session_id=eq.{{ $json.session_id }}
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
**Body**: (как в Варианте 1)

**Continue On Fail**: ON (чтобы не останавливать workflow, если сессия не найдена)

### Нода 2: Code - Проверка результата обновления

**Тип**: Code  
**Код**:
```javascript
const item = $input.item;

// Если обновление вернуло данные - сессия существовала
if (Array.isArray(item.json) && item.json.length > 0) {
  return {
    json: {
      ...item.json,
      session_updated: true,
      session_created: false,
      session_db_id: item.json[0].id,
    },
    binary: item.binary,
  };
}

// Сессия не найдена - нужно создать
// Возвращаем флаг для следующей ноды
return {
  json: {
    ...item.json,
    should_create_session: true,
    session_updated: false,
  },
  binary: item.binary,
};
```

### Нода 3: IF - Проверка should_create_session

**Тип**: IF  
**Condition**: `{{ $json.should_create_session === true }}`

### Нода 4: HTTP Request - Создание сессии (POST)

**Тип**: HTTP Request  
**Method**: POST  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/rest/v1/sessions
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
**Body**: (как в Варианте 1)

### Нода 5: Code - Объединение результатов

**Тип**: Code  
**Код**:
```javascript
const items = $input.all();

// Ищем результат с session_db_id
let result = null;
let baseData = {};

for (const item of items) {
  if (item.json.session_db_id) {
    result = item.json;
    break;
  } else if (item.json.id && Array.isArray(item.json) === false) {
    // Созданная сессия
    result = {
      ...item.json,
      session_created: true,
      session_updated: false,
      session_db_id: item.json.id,
    };
    break;
  }
  
  // Сохраняем базовые данные
  if (item.json.session_id && !baseData.session_id) {
    baseData = item.json;
  }
}

if (!result) {
  throw new Error('Failed to create or update session');
}

return {
  json: {
    ...baseData,
    ...result,
  },
  binary: items[0].binary,
};
```

## Рекомендация

Используйте Вариант 2 - он обеспечивает правильный UPSERT: сначала пытается обновить, если не найдено - создает.


