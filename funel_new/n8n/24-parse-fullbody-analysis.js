/**
 * Code нода: Парсинг результатов анализа fullbody
 * Извлекает и валидирует результаты анализа fullbody изображения от OpenAI
 * Исключает результаты, если качество изображения плохое
 */

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

console.log('Parsed fullbody analysis result:', analysisResult);

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

// Валидация archetype (определяется по позе, осанке, стилю одежды)
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

