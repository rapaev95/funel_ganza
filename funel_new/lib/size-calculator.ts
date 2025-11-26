/**
 * Логика подбора размера худи на основе роста и веса
 * Таблица размеров основана на обхвате груди и росте
 */

export type HoodieSize = 'S' | 'M' | 'L' | 'XL'

export interface SizeInfo {
  size: HoodieSize
  chestRange: { min: number; max: number }
  heightMax: number
  hoodieLength: number
  hoodieWidth: number
  sleeveLength: number
}

const SIZE_TABLE: Record<HoodieSize, SizeInfo> = {
  S: {
    size: 'S',
    chestRange: { min: 84, max: 92 },
    heightMax: 175,
    hoodieLength: 68,
    hoodieWidth: 73,
    sleeveLength: 74,
  },
  M: {
    size: 'M',
    chestRange: { min: 93, max: 100 },
    heightMax: 180,
    hoodieLength: 68.7,
    hoodieWidth: 76,
    sleeveLength: 76,
  },
  L: {
    size: 'L',
    chestRange: { min: 101, max: 112 },
    heightMax: 185,
    hoodieLength: 69.8,
    hoodieWidth: 81,
    sleeveLength: 79.5,
  },
  XL: {
    size: 'XL',
    chestRange: { min: 113, max: 122 },
    heightMax: 195,
    hoodieLength: 72.2,
    hoodieWidth: 85,
    sleeveLength: 83.5,
  },
}

/**
 * Приблизительный расчет обхвата груди на основе веса
 * Формула: базовый обхват + (вес - 50) * коэффициент
 */
function estimateChestCircumference(weight: number, gender?: 'male' | 'female'): number {
  const baseChest = gender === 'male' ? 90 : 85
  const coefficient = gender === 'male' ? 0.8 : 0.7
  const baseWeight = 50
  
  return Math.round(baseChest + (weight - baseWeight) * coefficient)
}

/**
 * Подбор размера на основе роста и веса
 * @param height Рост в см
 * @param weight Вес в кг
 * @param chestCircumference Обхват груди в см (опционально, если не указан - рассчитывается)
 * @param gender Пол (опционально, для более точного расчета обхвата груди)
 * @returns Размер худи
 */
export function calculateSize(
  height: number,
  weight: number,
  chestCircumference?: number,
  gender?: 'male' | 'female'
): HoodieSize {
  // Если обхват груди не указан, рассчитываем его
  const chest = chestCircumference || estimateChestCircumference(weight, gender)

  // Сначала проверяем по обхвату груди
  let matchingSizes: HoodieSize[] = []
  
  for (const [size, info] of Object.entries(SIZE_TABLE)) {
    if (chest >= info.chestRange.min && chest <= info.chestRange.max) {
      matchingSizes.push(size as HoodieSize)
    }
  }

  // Если нашли подходящие размеры, проверяем рост
  if (matchingSizes.length > 0) {
    // Фильтруем по росту
    const heightFiltered = matchingSizes.filter(
      (size) => height <= SIZE_TABLE[size].heightMax
    )

    if (heightFiltered.length > 0) {
      // Возвращаем самый маленький подходящий размер
      return heightFiltered[0]
    }

    // Если по росту ничего не подошло, возвращаем самый большой из подходящих по обхвату
    return matchingSizes[matchingSizes.length - 1]
  }

  // Если по обхвату ничего не подошло, подбираем по росту
  for (const [size, info] of Object.entries(SIZE_TABLE)) {
    if (height <= info.heightMax) {
      return size as HoodieSize
    }
  }

  // Если ничего не подошло, возвращаем XL (самый большой)
  return 'XL'
}

/**
 * Получить информацию о размере
 */
export function getSizeInfo(size: HoodieSize): SizeInfo {
  return SIZE_TABLE[size]
}

/**
 * Получить все доступные размеры
 */
export function getAllSizes(): HoodieSize[] {
  return ['S', 'M', 'L', 'XL']
}


