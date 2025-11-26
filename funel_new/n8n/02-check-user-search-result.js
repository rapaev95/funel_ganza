const items = $input.all();

console.log('=== Node 3: Check user search result ===');
console.log('Total items:', items.length);

// После Merge ноды данные объединены
// Результат HTTP Request может быть в одном элементе (массив)
// Исходные данные из парсинга в другом элементе

// Получаем результат поиска и исходные данные
let searchResult = [];
let baseData = {};

// UUID regex для проверки формата
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

for (const inputItem of items) {
  const json = inputItem.json;
  
  // Проверяем, это результат HTTP Request (массив) или объект с id
  if (Array.isArray(json)) {
    // Результат HTTP Request - массив
    searchResult = json;
    console.log('Found search result (array):', searchResult.length, 'items');
  } else if (json.id && uuidRegex.test(json.id) && json.tg_user_id) {
    // Это результат поиска (один пользователь) - пользователь НАЙДЕН
    searchResult = [json];
    console.log('Found user in search result:', json.id);
  } else if (json.session_id) {
    // Это исходные данные из парсинга
    baseData = { ...baseData, ...json };
    console.log('Found base data with session_id:', json.session_id);
  }
}

// Если пользователь найден (массив не пустой и есть id с UUID)
if (searchResult.length > 0 && searchResult[0] && searchResult[0].id && uuidRegex.test(searchResult[0].id)) {
  const userId = searchResult[0].id; // UUID из БД
  const tgUserId = searchResult[0].tg_user_id;
  const firstName = searchResult[0].first_name;
  
  console.log('User FOUND:', {
    user_id: userId,
    tg_user_id: tgUserId,
    first_name: firstName,
  });
  
  return {
    json: {
      ...baseData,
      user_id: userId, // UUID пользователя - ВАЖНО!
      tg_user_id: tgUserId,
      first_name: firstName,
      user_found: true,
      should_create_user: false, // Пользователь найден, создавать не нужно
    },
    binary: items[0]?.binary,
  };
}

// Пользователь НЕ найден - нужно создать
console.log('User NOT found, will create new user');

// Получаем tg_user_id из исходных данных
const tgUserId = baseData.user_id || baseData.body?.user_id;

if (!tgUserId) {
  console.error('Available data keys:', Object.keys(baseData));
  console.error('Items structure:', items.map((item, idx) => ({
    index: idx,
    keys: Object.keys(item.json),
  })));
  throw new Error('tg_user_id (Telegram ID) is required to create user. Check that data from parsing node is available.');
}

const firstName = baseData.first_name || baseData.body?.first_name || null;

console.log('Will create user:', {
  tg_user_id: tgUserId,
  first_name: firstName,
});

return {
  json: {
    ...baseData,
    should_create_user: true,
    user_found: false,
    tg_user_id: tgUserId,
    first_name: firstName,
  },
  binary: items[0]?.binary,
};

