const item = $input.item;

console.log('=== Node 22: Process session creation result ===');
console.log('Input item:', {
  has_json: !!item.json,
  json_type: Array.isArray(item.json) ? 'array' : typeof item.json,
  keys: item.json ? Object.keys(item.json) : [],
});

// Если данные пустые или это пустой массив
if (!item.json || (Array.isArray(item.json) && item.json.length === 0)) {
  console.error('Empty data received');
  throw new Error('No data received from Create Session node. Check that session was created successfully.');
}

// Обрабатываем данные из ноды 21 (Supabase - Create Session)
let result = null;

// Supabase нода возвращает массив с созданной записью
if (Array.isArray(item.json) && item.json.length > 0) {
  const sessionData = item.json[0];
  
  if (sessionData.id && sessionData.session_id) {
    // Сессия была создана
    result = {
      ...sessionData,
      session_created: true,
      session_updated: false,
      session_db_id: sessionData.id, // UUID сессии из БД
    };
    console.log('Found created session (from Supabase array):', sessionData.id);
  }
} 
// Если это объект (один результат)
else if (item.json.id && item.json.session_id) {
  // Сессия была создана
  result = {
    ...item.json,
    session_created: true,
    session_updated: false,
    session_db_id: item.json.id, // UUID сессии из БД
  };
  console.log('Found created session (from Supabase object):', item.json.id);
}
// Если уже есть session_db_id (из предыдущих нод)
else if (item.json.session_db_id) {
  result = {
    ...item.json,
    session_updated: item.json.session_updated || false,
    session_created: item.json.session_created || false,
  };
  console.log('Using existing session_db_id:', item.json.session_db_id);
}
// Пробуем найти id в данных
else if (item.json.id) {
  result = {
    ...item.json,
    session_created: true,
    session_updated: false,
    session_db_id: item.json.id,
  };
  console.log('Extracted session_db_id from id field:', item.json.id);
}

if (!result || !result.session_db_id) {
  console.error('Failed to find session_db_id');
  console.error('Available data:', JSON.stringify(item.json, null, 2));
  throw new Error('Failed to create session. No session_db_id or id found in result from Supabase Create Session node. Check that Supabase node returns the created record.');
}

console.log('Returning result:', {
  session_db_id: result.session_db_id,
  session_id: result.session_id,
  session_created: result.session_created,
  session_updated: result.session_updated,
});

return {
  json: {
    ...result,
  },
  binary: item.binary,
};

