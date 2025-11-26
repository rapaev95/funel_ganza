const items = $input.all();

// Собираем данные из всех предыдущих нод
let sessionExists = false;
let sessionsCount = 0;
let baseData = {};

for (const item of items) {
  // Проверяем существование сессии
  if (Array.isArray(item.json) && item.json.length > 0 && item.json[0].id) {
    sessionExists = true;
  }
  
  // Получаем количество сессий
  if (item.json.sessions_count !== undefined) {
    sessionsCount = item.json.sessions_count;
  }
  
  // Сохраняем базовые данные
  if (item.json.user_id && !baseData.user_id) {
    baseData = item.json;
  }
}

const MAX_FREE_REQUESTS = baseData.max_free_requests || 5;
const limitExceeded = !sessionExists && sessionsCount >= MAX_FREE_REQUESTS;

console.log('Session check:', {
  sessionExists,
  sessionsCount,
  limitExceeded,
});

return {
  json: {
    ...baseData,
    session_exists: sessionExists,
    sessions_count: sessionsCount,
    limit_exceeded: limitExceeded,
    max_free_requests: MAX_FREE_REQUESTS,
  },
  binary: items[0].binary,
};


