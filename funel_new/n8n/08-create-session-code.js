/**
 * Code нода: Создание/обновление сессии в таблице sessions (UPSERT)
 * Всегда сначала пытается обновить (PATCH), если не найдено - создает (POST)
 */

const item = $input.item;

// Получаем все необходимые данные
const userId = item.json.user_id; // UUID из предыдущей ноды
const sessionId = item.json.session_id;
const imageCount = parseInt(item.json.image_count || 2);
const age = item.json.age;
const gender = item.json.gender;
const budgetPreference = item.json.budget_preference;
const selfieUrl = item.json.selfie_url;
const fullbodyUrl = item.json.fullbody_url;

// Проверяем обязательные поля
if (!userId) {
  throw new Error('user_id (UUID) is required');
}
if (!sessionId) {
  throw new Error('session_id is required');
}

// Проверяем формат UUID
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(userId)) {
  throw new Error(`user_id must be valid UUID, got: ${userId}`);
}

const supabaseUrl = 'https://pflgjjcbmpqoqsqzdfto.supabase.co';

// Получаем Service Role Key
// В n8n Code нодах credentials могут быть недоступны напрямую
// Используем переменные окружения как основной способ
let supabaseKey;

// Способ 1: Переменные окружения (рекомендуется)
supabaseKey = $env?.SUPABASE_SERVICE_ROLE_KEY;

// Способ 2: Пробуем получить через credentials (если доступно)
if (!supabaseKey) {
  try {
    // Пробуем разные варианты получения credentials
    let credentials = null;
    
    // Вариант 1: через тип
    try {
      credentials = this.getCredentials('supabaseApi');
    } catch (e1) {
      // Вариант 2: через имя (без await, так как может быть синхронным)
      try {
        credentials = this.getCredentials('vibelook');
      } catch (e2) {
        // Вариант 3: через $credentials (если доступно)
        if (typeof $credentials !== 'undefined' && $credentials.vibelook) {
          credentials = $credentials.vibelook;
        }
      }
    }
    
    if (credentials) {
      supabaseKey = credentials.serviceRoleKey || 
                   credentials.service_role_key || 
                   credentials.apiKey || 
                   credentials.api_key ||
                   credentials.key;
      if (supabaseKey) {
        console.log('Got credentials from vibelook credential');
      }
    }
  } catch (credError) {
    console.warn('Could not get credentials:', credError.message);
  }
} else {
  console.log('Using credentials from environment variables');
}

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required. Please set it in n8n Settings → Variables. The credential "vibelook" cannot be accessed directly in Code nodes - use environment variables instead.');
}

console.log('Using Supabase key (first 20 chars):', supabaseKey.substring(0, 20) + '...');

// Формируем данные для создания/обновления сессии
const sessionData = {
  user_id: userId,
  session_id: sessionId,
  image_count: imageCount,
  age: age || null,
  gender: gender || null,
  budget_preference: budgetPreference || null,
  selfie_url: selfieUrl || null,
  fullbody_url: fullbodyUrl || null,
  utm_source: item.json.utm_source || null,
  utm_medium: item.json.utm_medium || null,
  utm_campaign: item.json.utm_campaign || null,
  utm_content: item.json.utm_content || null,
  utm_term: item.json.utm_term || null,
  fbclid: item.json.fbclid || null,
};

console.log('Upserting session with data:', {
  user_id: sessionData.user_id,
  session_id: sessionData.session_id,
  selfie_url: sessionData.selfie_url,
  fullbody_url: sessionData.fullbody_url,
});

let result;
let isUpdated = false;

// ВСЕГДА сначала пытаемся обновить (PATCH)
// Это безопаснее, чем проверять существование отдельно
const updateUrl = `${supabaseUrl}/rest/v1/sessions?session_id=eq.${sessionId}`;
let updateResponse;
try {
  updateResponse = await this.helpers.httpRequest({
    method: 'PATCH',
    url: updateUrl,
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: sessionData,
  });
} catch (error) {
  // Если обновление не удалось (сессия не найдена), updateResponse останется null
  updateResponse = null;
}

// Если обновление вернуло данные - сессия существовала и была обновлена
if (updateResponse && Array.isArray(updateResponse) && updateResponse.length > 0) {
  result = updateResponse[0];
  isUpdated = true;
  console.log('Session updated successfully:', result.id);
} else {
  // Сессия не найдена - создаем новую
  console.log('Session not found, creating new one...');
  const createUrl = `${supabaseUrl}/rest/v1/sessions`;
  
  try {
    const createResponse = await this.helpers.httpRequest({
      method: 'POST',
      url: createUrl,
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: sessionData,
    });

    if (!createResponse || !Array.isArray(createResponse) || createResponse.length === 0) {
      throw new Error('Failed to create session: empty response');
    }

    result = createResponse[0];
    isUpdated = false;
    console.log('Session created successfully:', result.id);
  } catch (createError) {
    // Если при создании получили ошибку дубликата - значит сессия появилась между проверкой и созданием
    // Пробуем еще раз обновить
    if (createError.message && (createError.message.includes('Duplicate') || createError.message.includes('409'))) {
      console.warn('Got duplicate error, retrying update...');
      try {
        const retryUpdate = await this.helpers.httpRequest({
          method: 'PATCH',
          url: updateUrl,
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: sessionData,
        });
        
        if (retryUpdate && Array.isArray(retryUpdate) && retryUpdate.length > 0) {
          result = retryUpdate[0];
          isUpdated = true;
          console.log('Session updated on retry:', result.id);
        } else {
          throw createError;
        }
      } catch (retryError) {
        throw createError;
      }
    } else {
      throw createError;
    }
  }
}

// Возвращаем данные с информацией о созданной/обновленной сессии
return {
  json: {
    ...item.json,
    session_created: !isUpdated,
    session_updated: isUpdated,
    session_db_id: result.id,
    session_data: result,
  },
  binary: item.binary,
};

