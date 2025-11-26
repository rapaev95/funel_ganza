# HTTP Request - Загрузка selfie в Supabase Storage

## Настройки ноды

**Тип**: HTTP Request  
**Method**: POST  
**URL**: 
```
https://pflgjjcbmpqoqsqzdfto.supabase.co/storage/v1/object/foto_client/user_images/{{ $json.user_id || $json.session_id }}/session_{{ $json.session_id }}/selfie.jpg
```

**Authentication**: Generic Credential Type или Headers

**Send Headers**: ON

**Headers**:
```
Authorization: Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
apikey: {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
Content-Type: {{ $binary.image_1.mimeType || "image/jpeg" }}
x-upsert: true
```

**Send Body**: ON  
**Body Content Type**: Binary Data  
**Binary Property**: `image_1`

**Options**:
- Follow Redirect: true
- Timeout: 30000

## Примечания

- Если `user_id` отсутствует, используется `session_id` для создания пути
- `x-upsert: true` позволяет перезаписать файл, если он уже существует
- Binary данные должны быть доступны как `$binary.image_1`


