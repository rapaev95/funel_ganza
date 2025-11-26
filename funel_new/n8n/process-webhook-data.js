/**
 * n8n Code Node: Подготовка данных для OpenAI анализа изображений
 * 
 * Обрабатывает файлы из multipart/form-data и возвращает binary данные для OpenAI ноды
 * и JSON с метаданными
 */

// Получаем данные из предыдущей ноды (webhook)
// В n8n при multipart/form-data файлы доступны как binary данные
const webhookData = $input.item.json;
const webhookBinary = $input.item.binary;

console.log('=== WEBHOOK DATA RECEIVED ===');
console.log('Received webhook data structure:', {
  jsonKeys: Object.keys(webhookData),
  binaryKeys: webhookBinary ? Object.keys(webhookBinary) : [],
  hasImage1: !!webhookBinary?.image_1,
  hasImage2: !!webhookBinary?.image_2,
});

// Парсим utm_data из JSON строки (критично: utm_data приходит как JSON строка)
let utmDataParsed = {};
try {
  const utmDataString = webhookData.utm_data || webhookData.body?.utm_data;
  console.log('[UTM Debug] Raw utm_data value:', utmDataString);
  console.log('[UTM Debug] Raw utm_data type:', typeof utmDataString);
  
  if (utmDataString) {
    if (typeof utmDataString === 'string') {
      utmDataParsed = JSON.parse(utmDataString);
      console.log('[UTM Debug] Parsed utm_data from string:', utmDataParsed);
    } else if (typeof utmDataString === 'object') {
      utmDataParsed = utmDataString;
      console.log('[UTM Debug] utm_data is already object:', utmDataParsed);
    }
  } else {
    console.log('[UTM Debug] No utm_data found in webhook data');
  }
} catch (error) {
  console.error('[UTM Debug] Error parsing utm_data:', error);
  console.error('[UTM Debug] Failed to parse utm_data string:', webhookData.utm_data || webhookData.body?.utm_data);
}

// Получаем метаданные из JSON
const metadata = {
  user_id: webhookData.user_id || webhookData.body?.user_id || null,
  first_name: webhookData.first_name || webhookData.body?.first_name || null,
  age: webhookData.age || webhookData.body?.age || null,
  gender: webhookData.gender || webhookData.body?.gender || null,
  budget_preference: webhookData.budget_preference || webhookData.body?.budget_preference || null,
  image_count: parseInt(webhookData.image_count || webhookData.body?.image_count || '0'),
  // Используем распарсенные UTM данные с fallback на прямые поля
  utm_source: utmDataParsed.utm_source || webhookData.utm_source || webhookData.body?.utm_source || null,
  utm_medium: utmDataParsed.utm_medium || webhookData.utm_medium || webhookData.body?.utm_medium || null,
  utm_campaign: utmDataParsed.utm_campaign || webhookData.utm_campaign || webhookData.body?.utm_campaign || null,
  utm_content: utmDataParsed.utm_content || webhookData.utm_content || webhookData.body?.utm_content || null,
  utm_term: utmDataParsed.utm_term || webhookData.utm_term || webhookData.body?.utm_term || null,
  fbclid: utmDataParsed.fbclid || webhookData.fbclid || webhookData.body?.fbclid || null,
  timestamp: webhookData.timestamp || webhookData.body?.timestamp || new Date().toISOString(),
};

console.log('Metadata extracted:', metadata);
console.log('[UTM Debug] Final UTM values in metadata:', {
  utm_source: metadata.utm_source,
  utm_medium: metadata.utm_medium,
  utm_campaign: metadata.utm_campaign,
  utm_content: metadata.utm_content,
  utm_term: metadata.utm_term,
  fbclid: metadata.fbclid,
});

// Проверяем наличие binary данных (файлов)
if (!webhookBinary || (!webhookBinary.image_1 && !webhookBinary.image_2)) {
  console.error('No image files found in binary data:', {
    binaryKeys: webhookBinary ? Object.keys(webhookBinary) : [],
  });
  throw new Error('No image files found in webhook binary data');
}

console.log('Processing images for OpenAI analysis');

// Формируем binary данные для OpenAI ноды (используем ключи image_1, image_2)
const binaryData = {};
const imagesInfo = {};

// Функция для получения размера binary данных
function getBinarySize(binary) {
  // Проверяем все возможные способы получения размера
  if (binary.dataSize !== undefined) {
    return parseInt(binary.dataSize);
  }
  if (binary.size !== undefined) {
    return parseInt(binary.size);
  }
  if (Buffer.isBuffer(binary.data)) {
    return binary.data.length;
  }
  if (typeof binary.data === 'string') {
    // Если это base64, вычисляем реальный размер
    if (binary.data.startsWith('data:')) {
      const base64Data = binary.data.split(',')[1];
      return Math.round(base64Data.length * 0.75);
    }
    // Если это обычная строка, возвращаем длину в байтах
    return Buffer.byteLength(binary.data, 'utf8');
  }
  if (binary.data && typeof binary.data === 'object') {
    // Попробуем получить размер из объекта
    if (binary.data.length !== undefined) {
      return binary.data.length;
    }
  }
  return 0;
}

// Обрабатываем image_1 (селфи) - передаем binary данные напрямую
if (webhookBinary.image_1) {
  const binary = webhookBinary.image_1;
  
  // Детальное логирование всех свойств
  console.log('Processing image_1 - Full binary object:', {
    keys: Object.keys(binary),
    hasData: !!binary.data,
    hasDataSize: binary.dataSize !== undefined,
    hasSize: binary.size !== undefined,
    dataType: typeof binary.data,
    isBuffer: Buffer.isBuffer(binary.data),
    mimeType: binary.mimeType,
    fileName: binary.fileName,
    dataSize: binary.dataSize,
    size: binary.size,
  });
  
  // Передаем binary данные напрямую (без изменений)
  binaryData.image_1 = binary;
  
  // Получаем размер для информации
  const sizeBytes = getBinarySize(binary);
  
  // Сохраняем информацию для JSON
  imagesInfo.selfie = {
    filename: binary.fileName || 'selfie.jpg',
    mime_type: binary.mimeType || 'image/jpeg',
    size_bytes: sizeBytes,
    index: 1,
  };
  
  console.log(`Image 1 (selfie): ${sizeBytes > 0 ? (sizeBytes / 1024).toFixed(2) + 'kB' : 'size unknown'}`);
} else {
  console.warn('WARNING: image_1 not found in webhook binary data');
}

// Обрабатываем image_2 (полный рост) - передаем binary данные напрямую
if (webhookBinary.image_2) {
  const binary = webhookBinary.image_2;
  
  // Детальное логирование всех свойств
  console.log('Processing image_2 - Full binary object:', {
    keys: Object.keys(binary),
    hasData: !!binary.data,
    hasDataSize: binary.dataSize !== undefined,
    hasSize: binary.size !== undefined,
    dataType: typeof binary.data,
    isBuffer: Buffer.isBuffer(binary.data),
    mimeType: binary.mimeType,
    fileName: binary.fileName,
    dataSize: binary.dataSize,
    size: binary.size,
  });
  
  // Передаем binary данные напрямую (без изменений)
  binaryData.image_2 = binary;
  
  // Получаем размер для информации
  const sizeBytes = getBinarySize(binary);
  
  // Сохраняем информацию для JSON
  imagesInfo.fullbody = {
    filename: binary.fileName || 'fullbody.jpg',
    mime_type: binary.mimeType || 'image/jpeg',
    size_bytes: sizeBytes,
    index: 2,
  };
  
  console.log(`Image 2 (fullbody): ${sizeBytes > 0 ? (sizeBytes / 1024).toFixed(2) + 'kB' : 'size unknown'}`);
} else {
  console.warn('WARNING: image_2 not found in webhook binary data');
}

// Формируем JSON объект с метаданными
const result = {
  // Метаданные пользователя
  user_id: metadata.user_id,
  first_name: metadata.first_name,
  age: metadata.age,
  gender: metadata.gender,
  budget_preference: metadata.budget_preference,
  
  // Информация об изображениях (для справки)
  images_info: imagesInfo,
  image_count: metadata.image_count || Object.keys(binaryData).length,
  
  // UTM параметры
  utm_source: metadata.utm_source,
  utm_medium: metadata.utm_medium,
  utm_campaign: metadata.utm_campaign,
  utm_content: metadata.utm_content,
  utm_term: metadata.utm_term,
  fbclid: metadata.fbclid,
  
  // Метаданные запроса
  timestamp: metadata.timestamp,
  processed_at: new Date().toISOString(),
};

console.log('=== DATA PREPARED FOR OPENAI ===');
console.log('Data prepared for OpenAI analysis:', {
  user_id: result.user_id,
  first_name: result.first_name,
  image_count: result.image_count,
  images_keys: Object.keys(imagesInfo),
  binary_keys: Object.keys(binaryData),
  images_info: Object.keys(imagesInfo).map(key => ({
    key,
    filename: imagesInfo[key].filename,
    mime_type: imagesInfo[key].mime_type,
    size_bytes: imagesInfo[key].size_bytes,
    size_kb: imagesInfo[key].size_bytes > 0 ? (imagesInfo[key].size_bytes / 1024).toFixed(2) : '0',
  })),
  binary_data_info: Object.keys(binaryData).map(key => {
    const bin = binaryData[key];
    const size = getBinarySize(bin);
    return {
      key,
      hasData: !!bin.data,
      dataType: typeof bin.data,
      isBuffer: Buffer.isBuffer(bin.data),
      size_bytes: size,
      size_kb: size > 0 ? (size / 1024).toFixed(2) : '0',
      fileName: bin.fileName,
      mimeType: bin.mimeType,
      hasDataSize: bin.dataSize !== undefined,
      hasSize: bin.size !== undefined,
    };
  }),
});

// Проверяем, что binary данные не пустые
const binaryKeys = Object.keys(binaryData);
console.log('Final binary data keys:', binaryKeys);
console.log('Total binary items:', binaryKeys.length);

if (binaryKeys.length === 0) {
  throw new Error('No binary data prepared for OpenAI');
}

if (binaryKeys.length > 2) {
  console.warn(`WARNING: More than 2 binary items found: ${binaryKeys.length}. Expected 2.`);
}

// Проверяем каждый binary элемент
for (const key of binaryKeys) {
  const bin = binaryData[key];
  if (!bin || !bin.data) {
    console.error(`WARNING: Binary data for ${key} is empty!`);
  } else {
    const size = Buffer.isBuffer(bin.data) ? bin.data.length : (typeof bin.data === 'string' ? bin.data.length : 0);
    console.log(`Binary ${key}: size=${size}, type=${typeof bin.data}, isBuffer=${Buffer.isBuffer(bin.data)}`);
  }
}

// Возвращаем JSON с метаданными + binary данные для OpenAI ноды
// Binary данные доступны как: binary.image_1 и binary.image_2
// В OpenAI ноде используйте: {{ $binary.image_1 }} и {{ $binary.image_2 }}
return {
  json: result,
  binary: binaryData,
};

