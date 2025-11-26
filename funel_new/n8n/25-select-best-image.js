/**
 * Code нода: Выбор лучшего изображения для анализа
 * Сравнивает качество selfie и fullbody изображений
 * Выбирает лучшее изображение для дальнейшего стилистического анализа
 */

const items = $input.all();

console.log('=== Node 25: Select best image ===');
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
      quality: json.selfie_quality,
      type: 'selfie',
    };
  }
  
  // Ищем данные о fullbody
  if (json.fullbody_quality_score !== undefined) {
    fullbodyData = {
      url: json.fullbody_url,
      quality_score: json.fullbody_quality_score,
      face_visible: json.fullbody_face_visible,
      body_visible: json.fullbody_body_visible,
      suitable: json.fullbody_suitable,
      quality: json.fullbody_quality,
      type: 'fullbody',
    };
  }
  
  // Сохраняем базовые данные
  if (json.session_db_id || json.session_id) {
    baseData = { ...baseData, ...json };
  }
}

console.log('Selfie data:', selfieData);
console.log('Fullbody data:', fullbodyData);

// Выбираем лучшее изображение на основе качества
let selectedImage = null;
let selectedAnalysis = null;
let selectionReason = '';

if (!selfieData && !fullbodyData) {
  throw new Error('No image analysis data found. Check that analysis nodes completed successfully.');
}

// Если только одно изображение доступно
if (!selfieData && fullbodyData) {
  selectedImage = fullbodyData;
  selectedAnalysis = items.find(item => item.json.fullbody_analysis)?.json.fullbody_analysis;
  selectionReason = 'Only fullbody image available';
} else if (selfieData && !fullbodyData) {
  selectedImage = selfieData;
  selectedAnalysis = items.find(item => item.json.selfie_analysis)?.json.selfie_analysis;
  selectionReason = 'Only selfie image available';
}
// Если оба доступны - выбираем лучшее
else {
  // Приоритет 1: Подходит ли для анализа (suitable_for_analysis = true)
  if (selfieData.suitable && !fullbodyData.suitable) {
    selectedImage = selfieData;
    selectedAnalysis = items.find(item => item.json.selfie_analysis)?.json.selfie_analysis;
    selectionReason = 'Selfie is suitable, fullbody is not';
  } else if (!selfieData.suitable && fullbodyData.suitable) {
    selectedImage = fullbodyData;
    selectedAnalysis = items.find(item => item.json.fullbody_analysis)?.json.fullbody_analysis;
    selectionReason = 'Fullbody is suitable, selfie is not';
  }
  // Если оба подходят или оба не подходят - продолжаем сравнение
  else {
    // Приоритет 2: Видимость лица (только если хотя бы одно подходит)
    if (selfieData.suitable || fullbodyData.suitable) {
      if (selfieData.face_visible && !fullbodyData.face_visible) {
        selectedImage = selfieData;
        selectedAnalysis = items.find(item => item.json.selfie_analysis)?.json.selfie_analysis;
        selectionReason = 'Selfie has visible face, fullbody does not';
      } else if (!selfieData.face_visible && fullbodyData.face_visible) {
        selectedImage = fullbodyData;
        selectedAnalysis = items.find(item => item.json.fullbody_analysis)?.json.fullbody_analysis;
        selectionReason = 'Fullbody has visible face, selfie does not';
      }
      // Приоритет 3: Качество изображения
      else if (selfieData.quality_score > fullbodyData.quality_score) {
        selectedImage = selfieData;
        selectedAnalysis = items.find(item => item.json.selfie_analysis)?.json.selfie_analysis;
        selectionReason = `Selfie has higher quality score (${selfieData.quality_score} vs ${fullbodyData.quality_score})`;
      } else if (fullbodyData.quality_score > selfieData.quality_score) {
        selectedImage = fullbodyData;
        selectedAnalysis = items.find(item => item.json.fullbody_analysis)?.json.fullbody_analysis;
        selectionReason = `Fullbody has higher quality score (${fullbodyData.quality_score} vs ${selfieData.quality_score})`;
      }
      // Если все равны - выбираем fullbody (так как там есть body_silhouette)
      else {
        selectedImage = fullbodyData;
        selectedAnalysis = items.find(item => item.json.fullbody_analysis)?.json.fullbody_analysis;
        selectionReason = 'Equal quality, defaulting to fullbody (has body_silhouette)';
      }
    }
    // Если оба не подходят - выбираем лучшее по качеству, но пометим как low_quality
    else {
      if (selfieData.quality_score > fullbodyData.quality_score) {
        selectedImage = selfieData;
        selectedAnalysis = items.find(item => item.json.selfie_analysis)?.json.selfie_analysis;
        selectionReason = `Both unsuitable, using selfie (higher quality: ${selfieData.quality_score} vs ${fullbodyData.quality_score}) - LOW QUALITY`;
      } else {
        selectedImage = fullbodyData;
        selectedAnalysis = items.find(item => item.json.fullbody_analysis)?.json.fullbody_analysis;
        selectionReason = `Both unsuitable, using fullbody (higher quality: ${fullbodyData.quality_score} vs ${selfieData.quality_score}) - LOW QUALITY`;
      }
    }
  }
}

console.log('Selected image:', {
  type: selectedImage.type,
  url: selectedImage.url,
  quality_score: selectedImage.quality_score,
  reason: selectionReason,
});

// Извлекаем стилистические параметры из выбранного анализа
const finalAnalysis = selectedAnalysis || {};

// Если выбранное изображение не подходит для анализа, все параметры должны быть null
const isLowQuality = !selectedImage.suitable;

// Если выбрано fullbody - используем его параметры (включая body_silhouette и archetype)
// Если выбрано selfie - используем его параметры, но body_silhouette и archetype берем из fullbody если есть
let bodySilhouette = null;
let archetype = null;
if (!isLowQuality) {
  if (selectedImage.type === 'fullbody' && finalAnalysis.body_silhouette) {
    bodySilhouette = finalAnalysis.body_silhouette;
    archetype = finalAnalysis.archetype || null;
  } else if (fullbodyData && fullbodyData.suitable) {
    // Если выбрали selfie, но есть fullbody анализ с хорошим качеством - берем body_silhouette и archetype оттуда
    const fullbodyItem = items.find(item => item.json.fullbody_body_silhouette || item.json.fullbody_archetype);
    if (fullbodyItem) {
      bodySilhouette = fullbodyItem.json.fullbody_body_silhouette || null;
      archetype = fullbodyItem.json.fullbody_archetype || null; // Приоритет: archetype определяется по позе в fullbody
    }
  }
  
  // Если archetype не найден в fullbody, но есть в выбранном анализе (для fullbody)
  if (!archetype && finalAnalysis.archetype) {
    archetype = finalAnalysis.archetype;
  }
}

// Возвращаем данные с выбранным изображением и финальными параметрами анализа
return {
  json: {
    ...baseData,
    selected_image_type: selectedImage.type,
    selected_image_url: selectedImage.url,
    selected_image_quality_score: selectedImage.quality_score,
    selection_reason: selectionReason,
    
    // Финальные стилистические параметры из выбранного изображения
    // Если качество плохое, все параметры = null
    color_temperature: isLowQuality ? null : (finalAnalysis.color_temperature || null),
    color_season: isLowQuality ? null : (finalAnalysis.color_season || null),
    contrast_level: isLowQuality ? null : (finalAnalysis.contrast_level || null),
    face_shape: isLowQuality ? null : (finalAnalysis.face_shape || null),
    body_silhouette: isLowQuality ? null : (bodySilhouette || null), // Берем из fullbody если доступно
    hair_color: isLowQuality ? null : (finalAnalysis.hair_color || null),
    archetype: isLowQuality ? null : (archetype || null), // Приоритет: из fullbody (определяется по позе)
    
    // Флаг низкого качества
    is_low_quality: isLowQuality,
    
    // Сохраняем данные о качестве обоих изображений
    selfie_quality_score: selfieData?.quality_score || null,
    fullbody_quality_score: fullbodyData?.quality_score || null,
    selfie_suitable: selfieData?.suitable || false,
    fullbody_suitable: fullbodyData?.suitable || false,
  },
  binary: items[0]?.binary,
};
