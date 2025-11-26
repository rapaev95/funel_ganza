const item = $input.item;

console.log('=== Node 19: Check session update result ===');
console.log('Input item:', {
  has_json: !!item.json,
  json_type: Array.isArray(item.json) ? 'array' : typeof item.json,
  keys: item.json ? Object.keys(item.json) : [],
  json_content: JSON.stringify(item.json).substring(0, 200),
});

// Функция для глубокого поиска session_id в объекте
function deepFindSessionId(obj, path = '') {
  if (!obj || typeof obj !== 'object') {
    return null;
  }
  
  // Если это массив, проверяем каждый элемент
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = deepFindSessionId(obj[i], `${path}[${i}]`);
      if (result) return result;
    }
    return null;
  }
  
  // Проверяем session_id напрямую
  if (obj.session_id) {
    return obj;
  }
  
  // Рекурсивно ищем во всех свойствах
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value && typeof value === 'object') {
        const result = deepFindSessionId(value, path ? `${path}.${key}` : key);
        if (result) return result;
      }
    }
  }
  
  return null;
}

// Функция для поиска session_id в данных
function findSessionData(items) {
  // Сначала ищем в текущем item
  if (item.json) {
    const found = deepFindSessionId(item.json);
    if (found) {
      console.log('Found session_id in current item');
      return found;
    }
  }
  
  // Ищем во всех input items
  for (let i = 0; i < items.length; i++) {
    const inputItem = items[i];
    const json = inputItem.json;
    
    if (!json) continue;
    
    // Глубокий поиск в этом элементе
    const found = deepFindSessionId(json, `items[${i}]`);
    if (found) {
      console.log(`Found session_id in input item ${i}`);
      return found;
    }
  }
  
  return null;
}

// Проверяем, пустой ли результат от Supabase
const isEmptyResult = !item.json || 
  (Array.isArray(item.json) && item.json.length === 0) ||
  (typeof item.json === 'object' && Object.keys(item.json).length === 0 && !item.json.id && !item.json.session_id);

// Если данные пустые или это пустой массив - сессия не найдена
if (isEmptyResult) {
  console.log('Session not found (empty result from Supabase Update), will create new');
  
  // Получаем базовые данные из предыдущих нод (Merge3)
  const items = $input.all();
  console.log('Total input items:', items.length);
  
  // Ищем данные с session_id (глубокий поиск)
  let baseData = findSessionData(items);
  
  // Если нашли только session_id, но нет других данных, собираем их из всех items
  if (baseData && baseData.session_id) {
    // Собираем все данные из items, которые могут быть полезны
    const allData = {};
    for (const inputItem of items) {
      if (inputItem.json && typeof inputItem.json === 'object' && !Array.isArray(inputItem.json)) {
        Object.assign(allData, inputItem.json);
      } else if (Array.isArray(inputItem.json) && inputItem.json.length > 0) {
        Object.assign(allData, inputItem.json[0]);
      }
    }
    // Объединяем найденные данные с базовыми
    baseData = { ...allData, ...baseData };
  }
  
  // Если все еще не нашли, выводим подробную информацию
  if (!baseData || !baseData.session_id) {
    console.error('=== DEBUG: Cannot find session_id ===');
    console.error('Total input items:', items.length);
    console.error('Items structure:', items.map((item, idx) => {
      const json = item.json;
      const sessionId = deepFindSessionId(json);
      return {
        index: idx,
        has_json: !!json,
        json_type: Array.isArray(json) ? 'array' : typeof json,
        keys: json && typeof json === 'object' ? Object.keys(json) : [],
        session_id_found: !!sessionId,
        session_id_value: sessionId?.session_id,
        json_preview: JSON.stringify(json).substring(0, 500),
      };
    }));
    
    // Пробуем найти session_id в любом месте
    let foundSessionId = null;
    for (const inputItem of items) {
      const found = deepFindSessionId(inputItem.json);
      if (found && found.session_id) {
        foundSessionId = found.session_id;
        console.log('Found session_id in deep search:', foundSessionId);
        break;
      }
    }
    
    if (!foundSessionId) {
      throw new Error('session_id not found in any input data. Check that Merge3 is connected to Node 7 (user results) and Node 17 (URLs), and that these nodes output session_id.');
    }
    
    // Если нашли только session_id, создаем минимальный объект
    baseData = { session_id: foundSessionId };
    // Пытаемся собрать остальные данные
    for (const inputItem of items) {
      if (inputItem.json && typeof inputItem.json === 'object') {
        baseData = { ...inputItem.json, ...baseData };
      }
    }
  }
  
  console.log('Found session_id:', baseData.session_id);
  
  return {
    json: {
      ...baseData,
      should_create_session: true,
      session_updated: false,
    },
    binary: item.binary || items[0]?.binary,
  };
}

// Обрабатываем результат обновления
let result = null;
let baseData = {};

// Если это массив результатов от Supabase
if (Array.isArray(item.json) && item.json.length > 0) {
  const sessionData = item.json[0];
  
  if (sessionData.id && sessionData.session_id) {
    // Сессия была обновлена
    result = {
      ...sessionData,
      session_updated: true,
      session_created: false,
      session_db_id: sessionData.id,
    };
    console.log('Session updated successfully:', sessionData.id);
  }
}
// Если это объект
else if (item.json.id && item.json.session_id) {
  // Сессия была обновлена
  result = {
    ...item.json,
    session_updated: true,
    session_created: false,
    session_db_id: item.json.id,
  };
  console.log('Session updated successfully:', item.json.id);
}
// Если есть session_db_id (из предыдущих нод)
else if (item.json.session_db_id) {
  result = {
    ...item.json,
    session_updated: true,
    session_created: false,
  };
  console.log('Session already updated:', item.json.session_db_id);
}
// Сохраняем как базовые данные
else {
  baseData = item.json;
  console.log('Saved as base data');
}

// Если сессия была обновлена
if (result && result.session_db_id) {
  return {
    json: {
      ...baseData,
      ...result,
    },
    binary: item.binary,
  };
}

// Сессия не найдена - нужно создать
// Используем базовые данные
if (!baseData || !baseData.session_id) {
  // Пробуем найти session_id в текущем item
  if (item.json && item.json.session_id) {
    baseData = item.json;
  } else {
    // Ищем в исходных данных
    const items = $input.all();
    baseData = findSessionData(items);
    
    // Если не нашли, пробуем найти в body
    if (!baseData || !baseData.session_id) {
      for (const inputItem of items) {
        const json = inputItem.json;
        if (json && json.body && json.body.session_id) {
          baseData = { ...json, ...json.body };
          break;
        }
      }
    }
  }
}

if (!baseData || !baseData.session_id) {
  console.error('Missing session_id. Available data:', {
    item_json_keys: item.json ? Object.keys(item.json) : [],
    item_json: JSON.stringify(item.json).substring(0, 300),
  });
  throw new Error('session_id not found. Check that data from previous nodes (Merge3) is available. Make sure Merge3 is connected to Node 7 (user results) and Node 17 (URLs).');
}

return {
  json: {
    ...baseData,
    should_create_session: true,
    session_updated: false,
  },
  binary: item.binary,
};

