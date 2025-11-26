/**
 * Code нода: Парсинг результатов анализа selfie
 * Извлекает и валидирует результаты анализа selfie изображения от OpenAI
 * Исключает результаты, если качество изображения плохое
 */

const item = $input.item;

// Получаем ответ от OpenAI
const content = item.json.choices?.[0]?.message?.content;

if (!content) {
  throw new Error('No content in OpenAI response for selfie analysis');
}

// Парсим JSON
let analysisResult;
try {
  analysisResult = typeof content === 'string' ? JSON.parse(content) : content;
} catch (error) {
  throw new Error(`Failed to parse selfie analysis result: ${error.message}`);
}

console.log('Parsed selfie analysis result:', analysisResult);

// Валидация: проверяем, что suitable_for_analysis определен
if (analysisResult.suitable_for_analysis === undefined) {
  console.warn('suitable_for_analysis not found in response, defaulting to false');
  analysisResult.suitable_for_analysis = false;
}

// Проверка качества: если quality_score < 50 или face_visible = false, исключаем результаты
if (analysisResult.quality_score !== undefined) {
  if (analysisResult.quality_score < 50) {
    console.log(`Selfie quality_score is ${analysisResult.quality_score} (< 50), marking as unsuitable`);
    analysisResult.suitable_for_analysis = false;
  }
}

if (analysisResult.face_visible === false) {
  console.log('Selfie face_visible is false, marking as unsuitable');
  analysisResult.suitable_for_analysis = false;
}

// Если качество плохое, исключаем результаты
if (!analysisResult.suitable_for_analysis) {
  console.log('Selfie image quality is poor, excluding from results');
  // Устанавливаем все стилистические параметры в null
  analysisResult.color_temperature = null;
  analysisResult.color_season = null;
  analysisResult.contrast_level = null;
  analysisResult.face_shape = null;
  analysisResult.hair_color = null;
  // Примечание: archetype НЕ определяется в selfie, только в fullbody (по позе)
} else {
  console.log('Selfie image quality is good, using results');
}

// Валидация допустимых значений
const validColorSeasons = [
  'bright_winter', 'cool_winter', 'deep_winter',
  'cool_summer', 'light_summer', 'soft_summer',
  'warm_spring', 'light_spring', 'bright_spring',
  'warm_autumn', 'soft_autumn', 'deep_autumn'
];

const validColorTemperatures = ['cool', 'warm', 'neutral'];
const validContrastLevels = ['high', 'medium', 'low'];
const validFaceShapes = ['oval', 'round', 'square', 'rectangle', 'triangle', 'inverted_triangle', 'diamond'];
const validHairColors = ['black', 'dark_brown', 'brown', 'light_brown', 'dark_blonde', 'ash_blonde', 'cool_blonde', 'platinum_blonde', 'red', 'copper', 'grey'];

// Валидация color_season
if (analysisResult.color_season && !validColorSeasons.includes(analysisResult.color_season)) {
  console.warn(`Invalid color_season: ${analysisResult.color_season}, setting to null`);
  analysisResult.color_season = null;
}

// Валидация color_temperature
if (analysisResult.color_temperature && !validColorTemperatures.includes(analysisResult.color_temperature)) {
  console.warn(`Invalid color_temperature: ${analysisResult.color_temperature}, setting to null`);
  analysisResult.color_temperature = null;
}

// Валидация contrast_level
if (analysisResult.contrast_level && !validContrastLevels.includes(analysisResult.contrast_level)) {
  console.warn(`Invalid contrast_level: ${analysisResult.contrast_level}, setting to null`);
  analysisResult.contrast_level = null;
}

// Валидация face_shape
if (analysisResult.face_shape && !validFaceShapes.includes(analysisResult.face_shape)) {
  console.warn(`Invalid face_shape: ${analysisResult.face_shape}, setting to null`);
  analysisResult.face_shape = null;
}

// Валидация hair_color
if (analysisResult.hair_color && !validHairColors.includes(analysisResult.hair_color)) {
  console.warn(`Invalid hair_color: ${analysisResult.hair_color}, setting to null`);
  analysisResult.hair_color = null;
}

// Сохраняем результаты
// Примечание: archetype НЕ определяется в selfie, только в fullbody (по позе)
return {
  json: {
    ...item.json,
    selfie_analysis: analysisResult,
    selfie_quality_score: analysisResult.quality_score || 0,
    selfie_face_visible: analysisResult.face_visible || false,
    selfie_suitable: analysisResult.suitable_for_analysis || false,
    // Стилистические параметры (могут быть null если качество плохое)
    // archetype определяется только в fullbody
    selfie_color_temperature: analysisResult.color_temperature || null,
    selfie_color_season: analysisResult.color_season || null,
    selfie_contrast_level: analysisResult.contrast_level || null,
    selfie_face_shape: analysisResult.face_shape || null,
    selfie_hair_color: analysisResult.hair_color || null,
  },
  binary: item.binary,
};

