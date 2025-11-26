/**
 * Code нода: Выбор типа фигуры (body_silhouette)
 * Определяет финальный тип фигуры на основе анализа
 */

const item = $input.item;

// Получаем тип фигуры из анализа
let bodyType = item.json.body_silhouette;

// Если тип фигуры не определен, пробуем определить по другим параметрам
if (!bodyType || bodyType === 'null' || bodyType === null) {
  console.warn('body_silhouette not found in analysis, trying to determine from other data');
  
  // Можно добавить логику определения типа фигуры на основе других параметров
  // Например, если есть face_shape, можно попробовать определить body_silhouette
  // Или использовать значения по умолчанию
  
  bodyType = 'hourglass'; // Значение по умолчанию
  console.log('Using default body type:', bodyType);
}

// Валидация типа фигуры
const validBodyTypes = ['hourglass', 'pear', 'apple', 'rectangle', 'inverted_triangle'];
if (!validBodyTypes.includes(bodyType)) {
  console.warn(`Invalid body type: ${bodyType}, using default`);
  bodyType = 'hourglass';
}

console.log('Selected body type:', bodyType);

return {
  json: {
    ...item.json,
    final_body_type: bodyType,
    body_silhouette: bodyType, // Обновляем body_silhouette финальным значением
  },
  binary: item.binary,
};


