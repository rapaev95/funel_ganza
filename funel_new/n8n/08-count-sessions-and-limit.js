const item = $input.item;
const sessionsResult = item.json;

const sessionsCount = Array.isArray(sessionsResult) ? sessionsResult.length : 0;
const MAX_FREE_REQUESTS = item.json.max_free_requests || 5;

console.log(`User has ${sessionsCount} sessions (limit: ${MAX_FREE_REQUESTS})`);

return {
  json: {
    ...item.json,
    sessions_count: sessionsCount,
    max_free_requests: MAX_FREE_REQUESTS,
  },
  binary: item.binary,
};


