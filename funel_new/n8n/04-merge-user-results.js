const items = $input.all();

console.log('=== Node 7: Merge user results ===');
console.log('Total items:', items.length);

// Ищем результат с user_id (UUID)
let userId = null;
let baseData = {};

// UUID regex для проверки формата
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

for (const item of items) {
  console.log('Checking item:', {
    has_user_id: !!item.json.user_id,
    user_id: item.json.user_id,
    user_id_type: typeof item.json.user_id,
    user_found: item.json.user_found,
    has_id: !!item.json.id,
    id: item.json.id,
  });
  
  if (item.json.user_id && item.json.user_found) {
    // Пользователь был найден
    if (uuidRegex.test(item.json.user_id)) {
      userId = item.json.user_id;
      baseData = item.json;
      console.log('Found user_id (UUID) from found user:', userId);
      break;
    } else {
      console.warn('user_id found but not valid UUID:', item.json.user_id);
    }
  } else if (item.json.id && !item.json.user_found) {
    // Пользователь был создан (ответ от POST /users)
    if (uuidRegex.test(item.json.id)) {
      userId = item.json.id;
      baseData = item.json;
      console.log('Found user_id (UUID) from created user:', userId);
      break;
    } else {
      console.warn('id found but not valid UUID:', item.json.id);
    }
  }
}

if (!userId) {
  console.error('=== ERROR: Failed to get user_id (UUID) ===');
  console.error('Available items:', items.map((item, idx) => ({
    index: idx,
    keys: Object.keys(item.json),
    user_id: item.json.user_id,
    id: item.json.id,
    user_found: item.json.user_found,
  })));
  throw new Error('Failed to get user_id (UUID) from previous nodes. Check that user search/creation nodes return user_id field.');
}

console.log('Returning user_id (UUID):', userId);

return {
  json: {
    ...baseData,
    user_id: userId, // UUID для следующих нод - ВАЖНО!
  },
  binary: items[0]?.binary,
};

