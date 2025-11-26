/**
 * Code нода: Поиск/создание пользователя в таблице users
 * Ищет пользователя по tg_user_id, если не найден - создает нового
 * Возвращает UUID пользователя в поле user_id
 */

const item = $input.item;

// Получаем Telegram ID из данных
const tgUserId = item.json.user_id || item.json.body?.user_id;
const firstName = item.json.first_name || item.json.body?.first_name || null;

if (!tgUserId) {
  throw new Error('tg_user_id is required to find or create user');
}

const supabaseUrl = 'https://pflgjjcbmpqoqsqzdfto.supabase.co';
const supabaseKey = $env.SUPABASE_SERVICE_ROLE_KEY;

let userId; // UUID пользователя

try {
  // 1. Ищем существующего пользователя по tg_user_id
  const searchUrl = `${supabaseUrl}/rest/v1/users?tg_user_id=eq.${tgUserId}&select=id,first_name,tg_user_id`;
  
  console.log('Searching for user with tg_user_id:', tgUserId);
  
  const searchResult = await $http.request({
    method: 'GET',
    url: searchUrl,
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
    },
  });

  if (searchResult && Array.isArray(searchResult) && searchResult.length > 0) {
    // Пользователь найден
    userId = searchResult[0].id;
    console.log('User found with UUID:', userId);
    
    // Опционально: обновляем first_name если изменился
    if (firstName && searchResult[0].first_name !== firstName) {
      const updateUrl = `${supabaseUrl}/rest/v1/users?id=eq.${userId}`;
      await $http.request({
        method: 'PATCH',
        url: updateUrl,
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
        },
        body: {
          first_name: firstName,
        },
      });
      console.log('Updated first_name for user:', userId);
    }
  } else {
    // Пользователь не найден - создаем нового
    console.log('User not found, creating new user...');
    
    const createUrl = `${supabaseUrl}/rest/v1/users`;
    const createResult = await $http.request({
      method: 'POST',
      url: createUrl,
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: {
        tg_user_id: tgUserId,
        first_name: firstName,
        language: 'ru',
      },
    });

    if (!createResult || !Array.isArray(createResult) || createResult.length === 0) {
      throw new Error('Failed to create user: empty response');
    }

    userId = createResult[0].id;
    console.log('User created with UUID:', userId);
  }
} catch (error) {
  console.error('Error in find/create user:', error);
  throw new Error(`Failed to find or create user: ${error.message}`);
}

// Возвращаем все данные + UUID пользователя
return {
  json: {
    ...item.json,
    user_id: userId, // UUID для создания сессии (важно!)
    tg_user_id: tgUserId, // Telegram ID (для справки)
    first_name: firstName,
  },
  binary: item.binary,
};


