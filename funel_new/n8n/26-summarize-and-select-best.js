/**
 * Code нода: Суммирование результатов и выбор лучшего изображения
 * Объединяет логику выбора лучшего изображения, суммирования результатов и формирования финальных параметров
 */

const items = $input.all();

console.log('=== Node 26: Summarize and select best ===');
console.log('Total items:', items.length);

// Собираем данные о качестве обоих изображений
let selfieData = null;
let fullbodyData = null;
let baseData = {};

for (const item of items) {
  const json = item.json;
  
  // Ищем данные о selfie
  if (json.selfie_quality_score !== undefined) {
    selfieData = {
      url: json.selfie_url,
      quality_score: json.selfie_quality_score,
      face_visible: json.selfie_face_visible,
      suitable: json.selfie_suitable,
      type: 'selfie',
      analysis: json.selfie_analysis || {},
    };
  }
  
  // Ищем данные о fullbody
  if (json.fullbody_quality_score !== undefined) {
    fullbodyData = {
      url: json.fullbody_url,
      quality_score: json.fullbody_quality_score,
      body_visible: json.fullbody_body_visible,
      suitable: json.fullbody_suitable,
      type: 'fullbody',
      analysis: json.fullbody_analysis || {},
    };
  }
  
  // Сохраняем базовые данные
  if (json.session_db_id || json.session_id) {
    baseData = { ...baseData, ...json };
  }
}

console.log('Selfie data:', selfieData);
console.log('Fullbody data:', fullbodyData);

// Выбираем лучшее изображение
let selectedImage = null;
let selectedAnalysis = null;
let selectionReason = '';

if (!selfieData && !fullbodyData) {
  throw new Error('No image analysis data found. Check that analysis nodes completed successfully.');
}

// Если только одно изображение доступно
if (!selfieData && fullbodyData) {
  selectedImage = fullbodyData;
  selectedAnalysis = fullbodyData.analysis;
  selectionReason = 'Only fullbody image available';
} else if (selfieData && !fullbodyData) {
  selectedImage = selfieData;
  selectedAnalysis = selfieData.analysis;
  selectionReason = 'Only selfie image available';
}
// Если оба доступны - выбираем лучшее
else {
  // Приоритет 1: Подходит ли для анализа
  if (selfieData.suitable && !fullbodyData.suitable) {
    selectedImage = selfieData;
    selectedAnalysis = selfieData.analysis;
    selectionReason = 'Selfie is suitable, fullbody is not';
  } else if (!selfieData.suitable && fullbodyData.suitable) {
    selectedImage = fullbodyData;
    selectedAnalysis = fullbodyData.analysis;
    selectionReason = 'Fullbody is suitable, selfie is not';
  }
  // Приоритет 2: Видимость лица
  else if (selfieData.face_visible && !fullbodyData.body_visible) {
    selectedImage = selfieData;
    selectedAnalysis = selfieData.analysis;
    selectionReason = 'Selfie has visible face, fullbody does not';
  } else if (!selfieData.face_visible && fullbodyData.body_visible) {
    selectedImage = fullbodyData;
    selectedAnalysis = fullbodyData.analysis;
    selectionReason = 'Fullbody has visible body, selfie does not';
  }
  // Приоритет 3: Качество изображения
  else if (selfieData.quality_score > fullbodyData.quality_score) {
    selectedImage = selfieData;
    selectedAnalysis = selfieData.analysis;
    selectionReason = `Selfie has higher quality score (${selfieData.quality_score} vs ${fullbodyData.quality_score})`;
  } else if (fullbodyData.quality_score > selfieData.quality_score) {
    selectedImage = fullbodyData;
    selectedAnalysis = fullbodyData.analysis;
    selectionReason = `Fullbody has higher quality score (${fullbodyData.quality_score} vs ${selfieData.quality_score})`;
  }
  // Если все равны - выбираем fullbody (так как там есть body_silhouette и archetype)
  else {
    selectedImage = fullbodyData;
    selectedAnalysis = fullbodyData.analysis;
    selectionReason = 'Equal quality, defaulting to fullbody (has body_silhouette and archetype)';
  }
}

const isLowQuality = !selectedImage.suitable;

// Извлекаем стилистические параметры
// Если выбрано fullbody - используем его параметры (включая body_silhouette и archetype)
// Если выбрано selfie - используем его параметры, но body_silhouette и archetype берем из fullbody если есть
let bodySilhouette = null;
let archetype = null;

if (!isLowQuality) {
  if (selectedImage.type === 'fullbody' && selectedAnalysis.body_silhouette) {
    bodySilhouette = selectedAnalysis.body_silhouette;
    archetype = selectedAnalysis.archetype || null;
  } else if (fullbodyData && fullbodyData.suitable) {
    // Если выбрали selfie, но есть fullbody анализ с хорошим качеством - берем body_silhouette и archetype оттуда
    const fullbodyItem = items.find(item => item.json.fullbody_body_silhouette || item.json.fullbody_archetype);
    if (fullbodyItem) {
      bodySilhouette = fullbodyItem.json.fullbody_body_silhouette || null;
      archetype = fullbodyItem.json.fullbody_archetype || null; // Приоритет: archetype определяется по позе в fullbody
    }
  }
  
  // Если archetype не найден в fullbody, но есть в выбранном анализе (для fullbody)
  if (!archetype && selectedAnalysis.archetype) {
    archetype = selectedAnalysis.archetype;
  }
}

// Формируем финальные параметры анализа
const finalParams = {
  color_temperature: isLowQuality ? null : (selectedAnalysis.color_temperature || null),
  color_season: isLowQuality ? null : (selectedAnalysis.color_season || null),
  contrast_level: isLowQuality ? null : (selectedAnalysis.contrast_level || null),
  face_shape: isLowQuality ? null : (selectedAnalysis.face_shape || null),
  body_silhouette: isLowQuality ? null : (bodySilhouette || null),
  hair_color: isLowQuality ? null : (selectedAnalysis.hair_color || null),
  archetype: isLowQuality ? null : (archetype || null),
};

// Формируем result_link через Set для уникальности параметров
const baseUrl = 'https://funelnew.vercel.app/result';
const paramsSet = new Set(); // Используем Set для уникальности

// Добавляем session_id (обязательный)
paramsSet.add(`session_id=${encodeURIComponent(baseData.session_id)}`);

// Добавляем name (если передан, используется в заголовке)
if (baseData.first_name && baseData.first_name !== 'null' && baseData.first_name !== null && baseData.first_name !== '') {
  paramsSet.add(`name=${encodeURIComponent(baseData.first_name)}`);
}

// Добавляем параметры анализа, если они есть (используем Set для уникальности)
Object.keys(finalParams).forEach(key => {
  const value = finalParams[key];
  if (value && value !== 'null' && value !== null && value !== '') {
    paramsSet.add(`${key}=${encodeURIComponent(value)}`);
  }
});

// Преобразуем Set в строку параметров
const queryString = Array.from(paramsSet).join('&');
const resultLink = `${baseUrl}?${queryString}`;

console.log('Final parameters:', finalParams);
console.log('Result link:', resultLink);

// Формируем данные для webhook
const webhookData = {
  session_id: baseData.session_id,
  status: 'completed',
  result_url: resultLink,
  analysis: finalParams,
  user_id: baseData.user_id,
  tg_user_id: baseData.tg_user_id,
  first_name: baseData.first_name,
  name: baseData.first_name, // Параметр name для использования в заголовке
};

// Формируем данные для Telegram (если нужно)
const telegramData = {
  chat_id: baseData.tg_user_id, // Telegram ID пользователя
  text: `Ваш анализ готов! Перейдите по ссылке: ${resultLink}`,
  parse_mode: 'HTML',
};

return {
  json: {
    ...baseData,
    // Метаданные выбора
    selected_image_type: selectedImage.type,
    selected_image_url: selectedImage.url,
    selected_image_quality_score: selectedImage.quality_score,
    selection_reason: selectionReason,
    is_low_quality: isLowQuality,
    
    // Финальные параметры анализа
    ...finalParams,
    
    // Ссылка и данные для отправки
    result_link: resultLink,
    result_url: resultLink,
    webhook_data: webhookData,
    telegram_data: telegramData,
    
    // Для обновления Supabase
    session_db_id: baseData.session_db_id || baseData.id,
    
    // Качество изображений (для справки)
    selfie_quality_score: selfieData?.quality_score || null,
    fullbody_quality_score: fullbodyData?.quality_score || null,
    selfie_suitable: selfieData?.suitable || false,
    fullbody_suitable: fullbodyData?.suitable || false,
  },
  binary: items[0]?.binary,
};

