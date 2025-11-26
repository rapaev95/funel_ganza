# HTTP Request нода - Отправка webhook в React

## Нода 30: HTTP Request - Webhook callback в React/Next.js

**Тип**: HTTP Request  
**Method**: POST  
**URL**: 
```
https://funel-ganza.vercel.app/api/webhook/callback
```

**Send Headers**: ON  
**Headers**:
```
Content-Type: application/json
```

**Send Body**: ON  
**Body Content Type**: JSON  
**Body**:
```json
{
  "session_id": "{{ $json.session_id }}",
  "status": "completed",
  "result_url": "{{ $json.result_link || $json.result_url }}",
  "session_db_id": "{{ $json.session_db_id || $json.id }}",
  "analysis": {
    "color_temperature": "{{ $json.color_temperature }}",
    "color_season": "{{ $json.color_season }}",
    "contrast_level": "{{ $json.contrast_level }}",
    "face_shape": "{{ $json.face_shape }}",
    "body_silhouette": "{{ $json.final_body_type || $json.body_silhouette }}",
    "hair_color": "{{ $json.hair_color }}",
    "archetype": "{{ $json.archetype }}"
  },
  "selected_image_type": "{{ $json.selected_image_type }}",
  "analysis_completed": true
}
```

**Или используйте подготовленные данные из ноды 29**:
```json
{{ $json.webhook_data }}
```

**Options**:
- Follow Redirect: true
- Timeout: 30000

**Continue On Fail**: ON (чтобы не останавливать workflow, если webhook не доставлен)

**Примечание**: 
- Webhook отправляет результаты анализа в React/Next.js приложение
- Next.js может использовать эти данные для отображения результатов пользователю
- Если webhook не доставлен, workflow продолжит выполнение (благодаря Continue On Fail)


