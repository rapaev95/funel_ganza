/**
 * Code нода: Парсинг данных из webhook
 * Извлекает метаданные, парсит UTM данные, подготавливает данные для следующих нод
 * HTTP запросы к Supabase вынесены в отдельные HTTP Request ноды
 */

const item = $input.item;

// Получаем данные из webhook
const webhookData = item.json;
const webhookBody = item.json.body || {};

// Извлекаем метаданные
const sessionId = webhookBody.session_id || webhookData.session_id;
const tgUserId = webhookBody.user_id || webhookData.user_id; // Telegram ID
const firstName = webhookBody.first_name || webhookData.first_name || null;
const age = webhookBody.age || webhookData.age;
const gender = webhookBody.gender || webhookData.gender;
const budgetPreference = webhookBody.budget_preference || webhookData.budget_preference;
const imageCount = parseInt(webhookBody.image_count || webhookData.image_count || '2');

// Парсим UTM данные
let utmData = {};
try {
  if (webhookBody.utm_data) {
    if (typeof webhookBody.utm_data === 'string') {
      utmData = JSON.parse(webhookBody.utm_data);
    } else {
      utmData = webhookBody.utm_data;
    }
  } else if (webhookData.utm_data) {
    if (typeof webhookData.utm_data === 'string') {
      utmData = JSON.parse(webhookData.utm_data);
    } else {
      utmData = webhookData.utm_data;
    }
  }
} catch (error) {
  console.warn('Failed to parse utm_data:', error);
  utmData = {};
}

// Проверяем наличие изображений
const hasImage1 = !!item.binary?.image_1;
const hasImage2 = !!item.binary?.image_2;

// Константы
const MAX_FREE_REQUESTS = 5; // Максимум бесплатных запросов

console.log('Parsed data:', {
  sessionId,
  tgUserId,
  firstName,
  age,
  gender,
  budgetPreference,
  imageCount,
  hasImage1,
  hasImage2,
  utmData,
});

// Возвращаем структурированные данные
// HTTP запросы к Supabase будут выполнены в следующих HTTP Request нодах
return {
  json: {
    // Основные данные
    session_id: sessionId,
    tg_user_id: tgUserId, // Telegram ID (будет использован для поиска пользователя)
    first_name: firstName,
    age: age,
    gender: gender,
    budget_preference: budgetPreference,
    image_count: imageCount,
    
    // UTM параметры
    utm_source: utmData.utm_source || null,
    utm_medium: utmData.utm_medium || null,
    utm_campaign: utmData.utm_campaign || null,
    utm_content: utmData.utm_content || null,
    utm_term: utmData.utm_term || null,
    fbclid: utmData.fbclid || null,
    
    // Флаги наличия изображений
    has_image_1: hasImage1,
    has_image_2: hasImage2,
    
    // Константы для следующих нод
    max_free_requests: MAX_FREE_REQUESTS,
    
    // Сохраняем исходные данные для справки
    body: webhookBody,
  },
  binary: item.binary, // Сохраняем binary данные изображений
};

