/**
 * Code нода: Формирование webhook ссылки с параметрами
 * Создает URL с параметрами анализа для отправки в React
 */

const item = $input.item;

// Получаем параметры анализа
const sessionId = item.json.session_id;
const colorTemperature = item.json.color_temperature;
const colorSeason = item.json.color_season;
const contrastLevel = item.json.contrast_level;
const faceShape = item.json.face_shape;
const bodySilhouette = item.json.final_body_type || item.json.body_silhouette;
const hairColor = item.json.hair_color;
const archetype = item.json.archetype;

if (!sessionId) {
  throw new Error('session_id not found');
}

// Базовый URL для результатов
const baseUrl = 'https://funel-ganza.vercel.app/result/';

// Формируем параметры URL
const params = new URLSearchParams();

// Добавляем session_id (обязательный параметр)
params.append('session_id', sessionId);

// Добавляем параметры анализа, если они есть
if (colorTemperature && colorTemperature !== 'null') {
  params.append('color_temperature', colorTemperature);
}
if (colorSeason && colorSeason !== 'null') {
  params.append('color_season', colorSeason);
}
if (contrastLevel && contrastLevel !== 'null') {
  params.append('contrast_level', contrastLevel);
}
if (faceShape && faceShape !== 'null') {
  params.append('face_shape', faceShape);
}
if (bodySilhouette && bodySilhouette !== 'null') {
  params.append('body_silhouette', bodySilhouette);
}
if (hairColor && hairColor !== 'null') {
  params.append('hair_color', hairColor);
}
if (archetype && archetype !== 'null') {
  params.append('archetype', archetype);
}

// Формируем полный URL
const resultLink = `${baseUrl}?${params.toString()}`;

console.log('Generated result_link:', resultLink);
console.log('Parameters:', {
  session_id: sessionId,
  color_temperature: colorTemperature,
  color_season: colorSeason,
  contrast_level: contrastLevel,
  face_shape: faceShape,
  body_silhouette: bodySilhouette,
  hair_color: hairColor,
  archetype: archetype,
});

return {
  json: {
    ...item.json,
    result_link: resultLink,
    result_url: resultLink, // Альтернативное название
    webhook_data: {
      session_id: sessionId,
      status: 'completed',
      result_url: resultLink,
      analysis: {
        color_temperature: colorTemperature,
        color_season: colorSeason,
        contrast_level: contrastLevel,
        face_shape: faceShape,
        body_silhouette: bodySilhouette,
        hair_color: hairColor,
        archetype: archetype,
      },
    },
  },
  binary: item.binary,
};


