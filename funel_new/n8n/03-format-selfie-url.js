/**
 * Code нода: Формирование publicUrl для selfie
 * Получает Key из ответа Supabase Storage и формирует публичный URL
 */

const item = $input.item;

// Получаем Key из ответа Supabase Storage
const key = item.json.Key || item.json.key;

if (!key) {
  console.error('Key not found in response:', item.json);
  throw new Error('Key not found in Supabase Storage response for selfie');
}

// Supabase URL
const supabaseUrl = 'https://pflgjjcbmpqoqsqzdfto.supabase.co';

// Формируем публичный URL
const publicUrl = `${supabaseUrl}/storage/v1/object/public/${key}`;

console.log('Selfie uploaded:', {
  key: key,
  publicUrl: publicUrl,
});

// Сохраняем исходные данные и добавляем URL
return {
  json: {
    ...item.json,
    // Сохраняем данные из ответа Supabase
    uploadKey_selfie: key,
    uploadId_selfie: item.json.Id || item.json.id,
    // Формируем публичный URL для selfie
    selfie_url: publicUrl,
  },
  binary: item.binary, // Сохраняем binary данные для следующих нод
};

