const items = $input.all();

console.log('=== DEBUG: Searching for user_id and session_id ===');
console.log('Total items:', items.length);

// Выводим структуру всех элементов для отладки
items.forEach((item, index) => {
  console.log(`Item ${index}:`, {
    keys: Object.keys(item.json),
    user_id: item.json.user_id,
    user_id_type: typeof item.json.user_id,
    session_id: item.json.session_id,
    has_body: !!item.json.body,
    tg_user_id: item.json.tg_user_id,
  });
  
  // Выводим полную структуру для всех элементов, чтобы найти user_id
  console.log(`Full structure of item ${index}:`, JSON.stringify(item.json, null, 2));
});

// Ищем данные во всех элементах
let user_id = null;
let session_id = null;
let baseData = {};

// UUID regex для проверки формата
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Проходим по всем элементам и собираем данные
// После Merge3 ноды данные могут быть в разных элементах массива:
// - Элемент 1: данные из ноды парсинга (session_id, tg_user_id и т.д.)
// - Элемент 2: данные из Merge2 (selfie_url, fullbody_url)
// - Элемент 3: данные из ноды 7 (user_id UUID) - если подключена

for (const item of items) {
  const json = item.json;
  
  // Ищем user_id (UUID) - проверяем формат UUID
  // Это должно быть из ноды 7 (Code - Объединение результатов пользователя)
  if (json.user_id) {
    if (typeof json.user_id === 'string' && uuidRegex.test(json.user_id)) {
      user_id = json.user_id;
      console.log('Found user_id (UUID) in json.user_id:', user_id);
    } else {
      console.log('Found user_id but not valid UUID:', json.user_id, 'Type:', typeof json.user_id);
    }
  }
  
  // Ищем session_id (из ноды парсинга)
  if (json.session_id && typeof json.session_id === 'string' && json.session_id !== 'undefined' && json.session_id !== 'null' && json.session_id !== '') {
    session_id = json.session_id;
    console.log('Found session_id:', session_id);
  }
  
  // Собираем все данные в baseData (объединяем все элементы)
  // Приоритет отдаем элементам с session_id (данные из парсинга)
  if (json.session_id) {
    // Объединяем данные, приоритет отдаем более полным объектам
    baseData = { ...baseData, ...json };
  } else {
    // Если нет session_id, все равно добавляем данные (например, URLs из Merge2 или user_id из ноды 7)
    baseData = { ...baseData, ...json };
  }
  
  // Также проверяем вложенные объекты
  if (json.body) {
    if (json.body.session_id && !session_id) {
      session_id = json.body.session_id;
      console.log('Found session_id in body:', session_id);
    }
    // Добавляем данные из body
    baseData = { ...baseData, ...json.body };
  }
  
  // Проверяем все возможные поля для user_id (UUID)
  // Это может быть из ноды 7, которая возвращает user_id после поиска/создания пользователя
  // ИЛИ из ноды 3 (проверка результата поиска), которая возвращает user_id из поля id
  const possibleUserIdFields = ['user_id', 'id', 'userId', 'user_uuid', 'uuid'];
  for (const field of possibleUserIdFields) {
    if (json[field] && typeof json[field] === 'string' && uuidRegex.test(json[field]) && !user_id) {
      // Проверяем, что это не session_id (тоже UUID)
      if (json.session_id !== json[field]) {
        user_id = json[field];
        console.log(`Found user_id (UUID) in field ${field}:`, user_id);
        break;
      }
    }
  }
}

// Если user_id все еще не найден, пробуем получить из предыдущих нод
// Возможно, нужно получить напрямую из ноды 7 (Объединение результатов пользователя)
if (!user_id) {
  console.log('=== Trying to find user_id in all items more thoroughly ===');
  
  // Пробуем найти в массивах результатов
  for (const item of items) {
    // Если это массив результатов от Supabase
    if (Array.isArray(item.json) && item.json.length > 0) {
      const firstResult = item.json[0];
      if (firstResult.id && uuidRegex.test(firstResult.id)) {
        // Это может быть результат создания пользователя
        user_id = firstResult.id;
        console.log('Found user_id in array result:', user_id);
        break;
      }
    }
    
    // Проверяем все вложенные объекты
    const checkNested = (obj, path = '') => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const currentPath = path ? `${path}.${key}` : key;
          
          if (key === 'user_id' || key === 'id') {
            if (typeof value === 'string' && uuidRegex.test(value)) {
              console.log(`Found potential user_id at ${currentPath}:`, value);
              if (!user_id) {
                user_id = value;
              }
            }
          }
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            checkNested(value, currentPath);
          }
        }
      }
    };
    
    checkNested(item.json);
  }
  
  // Если все еще не найден, пробуем получить из ноды 7 через Merge
  // Нода 7 должна была сохранить user_id, проверим все возможные пути
  if (!user_id) {
    console.log('=== Last attempt: checking all possible paths ===');
    // Пробуем найти в любом месте, где может быть UUID
    for (const item of items) {
      const allValues = JSON.stringify(item.json);
      const uuidMatches = allValues.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
      if (uuidMatches && uuidMatches.length > 0) {
        // Берем первый UUID, который может быть user_id
        // Но нужно проверить, что это не session_id
        for (const uuid of uuidMatches) {
          if (item.json.session_id !== uuid) {
            user_id = uuid;
            console.log('Found potential user_id (UUID) in JSON:', user_id);
            break;
          }
        }
        if (user_id) break;
      }
    }
  }
}

// Проверяем обязательные поля
if (!user_id) {
  console.error('=== ERROR: user_id (UUID) not found ===');
  console.error('Available data structure:');
  items.forEach((item, idx) => {
    console.error(`Item ${idx} keys:`, Object.keys(item.json));
    if (item.json.user_id) {
      console.error(`Item ${idx} user_id value:`, item.json.user_id, 'Type:', typeof item.json.user_id);
    }
    if (item.json.tg_user_id) {
      console.error(`Item ${idx} tg_user_id value:`, item.json.tg_user_id);
    }
  });
  
  // Если user_id не найден, но есть tg_user_id, это означает, что нода 7 не подключена к Merge3
  // Или нода 7 не возвращает user_id правильно
  if (baseData.tg_user_id) {
    console.error('=== DEBUG: user_id not found but tg_user_id exists ===');
    console.error('tg_user_id:', baseData.tg_user_id);
    console.error('This means node 7 (Code - Merge user results) is either:');
    console.error('1. Not connected to Merge3, OR');
    console.error('2. Not returning user_id (UUID) field correctly, OR');
    console.error('3. Merge3 is not combining data correctly');
    console.error('');
    console.error('=== All items after Merge3 ===');
    items.forEach((item, idx) => {
      console.error(`Item ${idx}:`, {
        keys: Object.keys(item.json),
        has_user_id: !!item.json.user_id,
        user_id_value: item.json.user_id,
        user_id_type: typeof item.json.user_id,
        has_tg_user_id: !!item.json.tg_user_id,
        tg_user_id_value: item.json.tg_user_id,
        has_session_id: !!item.json.session_id,
      });
    });
    console.error('');
    console.error('=== Expected ===');
    console.error('One of the items should have user_id field with UUID value (e.g., "19da9c18-5d1a-400b-8f63-0e9e093f3f95")');
    console.error('This should come from Node 7 (Code - Merge user results)');
    console.error('');
    console.error('=== Solution ===');
    console.error('1. Check Node 7 output - it should return user_id (UUID) field');
    console.error('2. Check that Node 7 is connected to Merge3');
    console.error('3. Check Merge3 mode - should be "Merge By Index" or "Append"');
    console.error('4. After Merge3, one of the items should contain user_id from Node 7');
    
    throw new Error(`user_id (UUID) is required but not found. Found tg_user_id: ${baseData.tg_user_id} (this is NOT a UUID). Check logs above for detailed debug info. SOLUTION: 1) Verify Node 7 returns user_id (UUID) field, 2) Verify Node 7 is connected to Merge3, 3) Check Merge3 combines data correctly.`);
  }
  
  throw new Error('user_id (UUID) is required but not found. The user_id should come from node 7 (Code - Merge user results). SOLUTION: Make sure Merge3 node (before node 18) is connected to Node 7 (Code - Merge user results) which contains user_id UUID. Currently Merge3 is missing connection to node 7. Add connection: Node 7 → Merge3.');
}

if (!session_id) {
  console.error('=== ERROR: session_id not found ===');
  throw new Error('session_id is required but not found in input data');
}

// Функция для безопасного получения значения
// Проверяем все возможные места, где могут быть данные
const getValue = (key) => {
  // Сначала проверяем в baseData
  let value = baseData[key];
  
  // Если не найдено, проверяем в body
  if (!value && baseData.body) {
    value = baseData.body[key];
  }
  
  // Если все еще не найдено, проверяем во всех элементах
  if (!value) {
    for (const item of items) {
      if (item.json[key]) {
        value = item.json[key];
        break;
      }
      if (item.json.body?.[key]) {
        value = item.json.body[key];
        break;
      }
    }
  }
  
  if (!value || value === 'null' || value === 'undefined' || value === '') {
    return null;
  }
  return value;
};

// Формируем body для создания сессии
const requestBody = {
  user_id: user_id, // UUID
  session_id: session_id,
  image_count: parseInt(getValue('image_count')) || 2,
  age: getValue('age'),
  gender: getValue('gender'),
  budget_preference: getValue('budget_preference'),
  selfie_url: getValue('selfie_url'),
  fullbody_url: getValue('fullbody_url'),
  utm_source: getValue('utm_source'),
  utm_medium: getValue('utm_medium'),
  utm_campaign: getValue('utm_campaign'),
  utm_content: getValue('utm_content'),
  utm_term: getValue('utm_term'),
  fbclid: getValue('fbclid'),
};

console.log('=== Prepared request body ===');
console.log('user_id:', requestBody.user_id);
console.log('session_id:', requestBody.session_id);
console.log('selfie_url:', requestBody.selfie_url);
console.log('fullbody_url:', requestBody.fullbody_url);

// Обновляем baseData с найденным user_id
baseData.user_id = user_id;

return {
  json: {
    ...baseData,
    request_body: requestBody,
    user_id: user_id, // Сохраняем для URL
    session_id: session_id, // Сохраняем для URL
  },
  binary: items[0]?.binary,
};

