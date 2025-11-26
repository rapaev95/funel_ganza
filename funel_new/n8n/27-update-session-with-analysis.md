# Supabase нода - Обновление сессии с результатами анализа

## Нода 27: Supabase - Обновление сессии с результатами анализа

**Тип**: Supabase  
**Operation**: Update  
**Table**: `sessions`  
**Credential**: vibelook

**Select Conditions** (для поиска сессии):
- **Field Name or ID**: `id` (или `session_db_id` если используете)
- **Condition**: **Equals**
- **Field Value**: `{{ $json.session_db_id || $json.id }}`

**Fields to Update** (результаты анализа):
- `color_temperature`: `{{ $json.color_temperature }}`
- `color_season`: `{{ $json.color_season }}`
- `contrast_level`: `{{ $json.contrast_level }}`
- `face_shape`: `{{ $json.face_shape }}`
- `body_silhouette`: `{{ $json.body_silhouette }}`
- `hair_color`: `{{ $json.hair_color }}`
- `archetype`: `{{ $json.archetype }}`

**Дополнительные поля** (метаданные анализа):
- `selected_image_type`: `{{ $json.selected_image_type }}` (если есть такое поле в таблице)
- `analysis_completed`: `true` (если есть такое поле в таблице)

**Options**:
- Return All: ON (чтобы получить обновленную запись)

**Примечание**: 
- Используйте `session_db_id` для поиска записи (это UUID из поля `id` таблицы sessions)
- Если `session_db_id` не доступен, используйте `id` из данных ноды 22


