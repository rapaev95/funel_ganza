/**
 * Code нода: Объединение URL обоих изображений
 * Собирает selfie_url и fullbody_url из предыдущих нод
 * ВАЖНО: Сохраняет user_id (UUID) из предыдущих нод
 */

const items = $input.all();

// Собираем все данные из предыдущих нод
let selfieUrl = null;
let fullbodyUrl = null;
let baseData = {};
let sessionId = null;
let userId = null; // UUID пользователя (не tg_user_id!)

// UUID regex для проверки формата
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Проходим по всем элементам и собираем данные
for (const item of items) {
  // Сохраняем базовые данные, приоритет отдаем элементам с user_id (UUID)
  if (!baseData.session_id || (item.json.user_id && uuidRegex.test(item.json.user_id))) {
    sessionId = item.json.session_id || sessionId;
    
    // Ищем user_id (UUID) - это важно!
    if (item.json.user_id && uuidRegex.test(item.json.user_id)) {
      userId = item.json.user_id;
      console.log('Found user_id (UUID):', userId);
    }
    
    // Сохраняем все данные из этого элемента
    baseData = { ...item.json };
  }
  
  // Ищем URL изображений
  if (item.json.selfie_url) {
    selfieUrl = item.json.selfie_url;
  }
  if (item.json.fullbody_url) {
    fullbodyUrl = item.json.fullbody_url;
  }
  
  // Также проверяем publicUrl (на случай, если он есть)
  if (item.json.publicUrl) {
    if (item.json.publicUrl.includes('selfie')) {
      selfieUrl = item.json.publicUrl;
    } else if (item.json.publicUrl.includes('fullbody')) {
      fullbodyUrl = item.json.publicUrl;
    }
  }
}

// Убеждаемся, что user_id сохранен
if (userId && uuidRegex.test(userId)) {
  baseData.user_id = userId;
}

console.log('Merged URLs:', {
  selfieUrl: selfieUrl,
  fullbodyUrl: fullbodyUrl,
  sessionId: sessionId,
  userId: userId,
  hasUserId: !!baseData.user_id,
});

// Проверяем обязательные поля
if (!baseData.user_id || !uuidRegex.test(baseData.user_id)) {
  console.error('WARNING: user_id (UUID) not found or invalid!');
  console.error('Available data keys:', Object.keys(baseData));
  console.error('Items structure:', items.map((item, idx) => ({
    index: idx,
    keys: Object.keys(item.json),
    user_id: item.json.user_id,
  })));
}

if (!sessionId) {
  console.error('WARNING: session_id not found!');
}

// Проверяем, что оба URL получены
if (!selfieUrl || !fullbodyUrl) {
  console.warn('Missing URLs:', {
    hasSelfie: !!selfieUrl,
    hasFullbody: !!fullbodyUrl,
  });
}

// Возвращаем объединенные данные
return {
  json: {
    ...baseData,
    user_id: baseData.user_id || userId, // Гарантируем наличие user_id
    session_id: sessionId || baseData.session_id, // Гарантируем наличие session_id
    selfie_url: selfieUrl,
    fullbody_url: fullbodyUrl,
    uploads_completed: !!(selfieUrl && fullbodyUrl),
  },
  binary: items[0]?.binary, // Сохраняем binary данные для анализа OpenAI
};

