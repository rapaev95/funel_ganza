/**
 * Code нода: Формирование publicUrl для fullbody
 * Получает Key из ответа Supabase Storage и формирует публичный URL
 */

const item = $input.item;

// Получаем Key из ответа Supabase Storage
const key = item.json.Key || item.json.key;

if (!key) {
  console.error('Key not found in response:', item.json);
  throw new Error('Key not found in Supabase Storage response for fullbody');
}

// Supabase URL
const supabaseUrl = 'https://pflgjjcbmpqoqsqzdfto.supabase.co';

// Формируем публичный URL
const publicUrl = `${supabaseUrl}/storage/v1/object/public/${key}`;

console.log('Fullbody uploaded:', {
  key: key,
  publicUrl: publicUrl,
});

// Сохраняем исходные данные и добавляем URL
return {
  json: {
    ...item.json,
    // Сохраняем данные из ответа Supabase
    uploadKey_fullbody: key,
    uploadId_fullbody: item.json.Id || item.json.id,
    // Формируем публичный URL для fullbody
    fullbody_url: publicUrl,
  },
  binary: item.binary, // Сохраняем binary данные для следующих нод
};

