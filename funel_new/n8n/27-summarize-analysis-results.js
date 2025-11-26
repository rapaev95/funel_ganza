/**
 * Code нода: Суммирование результатов анализа
 * Объединяет все результаты анализа в единую структуру
 */

const item = $input.item;

// Собираем все результаты анализа
const analysisData = {
  // Результаты стилистического анализа
  color_temperature: item.json.color_temperature,
  color_season: item.json.color_season,
  contrast_level: item.json.contrast_level,
  face_shape: item.json.face_shape,
  body_silhouette: item.json.body_silhouette,
  hair_color: item.json.hair_color,
  archetype: item.json.archetype,
  
  // Метаданные
  session_id: item.json.session_id,
  session_db_id: item.json.session_db_id,
  selected_image_type: item.json.selected_image_type,
  selected_image_url: item.json.selected_image_url,
  selected_image_quality_score: item.json.selected_image_quality_score,
  selection_reason: item.json.selection_reason,
  
  // Качество изображений
  selfie_quality_score: item.json.selfie_quality_score,
  fullbody_quality_score: item.json.fullbody_quality_score,
  selfie_suitable: item.json.selfie_suitable,
  fullbody_suitable: item.json.fullbody_suitable,
  
  // Флаги
  analysis_completed: item.json.analysis_completed || true,
};

console.log('Summarized analysis results:', analysisData);

return {
  json: {
    ...item.json,
    analysis_summary: analysisData,
  },
  binary: item.binary,
};


