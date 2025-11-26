import { ColorSeason, ColorTemperature, ContrastLevel, HairColor } from '@/types/result'
import { getColorPalette } from './dictionaries'
import { Product, ProductColor, getAllProducts, getProductsBySeason, getProductsByColor } from './products'

/**
 * Маппинг цветотипа к сезону товаров
 */
const SEASON_TO_PRODUCT_SEASON: Record<ColorSeason, 'winter' | 'spring' | 'summer' | 'autumn'> = {
  bright_winter: 'winter',
  cool_winter: 'winter',
  deep_winter: 'winter',
  cool_summer: 'summer',
  light_summer: 'summer',
  soft_summer: 'summer',
  warm_spring: 'spring',
  light_spring: 'spring',
  bright_spring: 'spring',
  warm_autumn: 'autumn',
  soft_autumn: 'autumn',
  deep_autumn: 'autumn',
}

/**
 * Маппинг цветов товаров к HEX цветам для проверки палитры
 */
const PRODUCT_COLOR_TO_HEX: Record<ProductColor, string[]> = {
  black: ['#000000', '#1C1C1C', '#2F4F4F'],
  white: ['#FFFFFF', '#FFFACD', '#FFF8DC'],
  fuchsia: ['#FF00FF', '#FF1493', '#FF69B4'],
  purple: ['#8B00FF', '#9370DB', '#4B0082'],
  red: ['#FF0033', '#DC143C', '#8B0000', '#B22222'],
  turquoise: ['#00CED1', '#00BFFF', '#008B8B'],
  golden: ['#FFD700', '#FFC125', '#B8860B'],
  lemon: ['#FFFF00', '#F0E68C', '#FFFACD'],
  mint: ['#98FB98', '#90EE90', '#50C878'],
  peach: ['#FFDAB9', '#FFB6C1', '#FFC0CB'],
  salmon: ['#FF7F50', '#FF6347', '#FF8C00'],
  skyblue: ['#87CEEB', '#B0E0E6', '#E0F6FF'],
  dustyblue: ['#708090', '#4682B4', '#36454F'],
  dustyrose: ['#BC9A6A', '#D2B48C', '#DEB887'],
  gray: ['#708090', '#A9A9A9', '#808080'],
  lavender: ['#E6E6FA', '#DDA0DD', '#C8A2C8'],
  lilac: ['#8B7D8B', '#DA70D6', '#9370DB'],
  powder: ['#FFB6C1', '#FFC0CB', '#F5DEB3'],
  terracotta: ['#CD853F', '#8B4513', '#A0522D'],
}

/**
 * Проверка, находится ли цвет в списке избегаемых
 */
function isColorInAvoidList(color: ProductColor, avoidColors: string[]): boolean {
  const colorHexes = PRODUCT_COLOR_TO_HEX[color] || []
  
  // Проверяем, пересекаются ли HEX коды цвета товара с avoid списком
  return colorHexes.some(hex => 
    avoidColors.some(avoidHex => {
      // Простое сравнение HEX (можно улучшить с учетом близости цветов)
      return hex.toLowerCase() === avoidHex.toLowerCase()
    })
  )
}

/**
 * Проверка, находится ли цвет в списке рекомендованных
 */
function isColorInRecommendedList(color: ProductColor, recommendedColors: string[]): boolean {
  const colorHexes = PRODUCT_COLOR_TO_HEX[color] || []
  
  // Проверяем, пересекаются ли HEX коды цвета товара с recommended списком
  return colorHexes.some(hex => 
    recommendedColors.some(recHex => {
      return hex.toLowerCase() === recHex.toLowerCase()
    })
  )
}

/**
 * Получить рекомендованные товары на основе цветотипа
 * Возвращает все товары без фильтрации по сезону
 */
export function getRecommendedProducts(
  colorSeason: ColorSeason,
  colorTemperature: ColorTemperature,
  contrastLevel: ContrastLevel,
  hairColor: HairColor
): Product[] {
  // Возвращаем все товары, независимо от сезона
  return getAllProducts()
}

/**
 * Получить товары для первой подборки (streetwear)
 * Все товары без фильтрации
 */
export function getStreetwearProducts(
  colorSeason: ColorSeason,
  colorTemperature: ColorTemperature,
  contrastLevel: ContrastLevel,
  hairColor: HairColor
): Product[] {
  // Возвращаем все товары, независимо от сезона
  return getAllProducts()
}

/**
 * Получить товары по цвету для подборки
 * Возвращает все товары указанного цвета без фильтрации
 */
export function getProductsByColorForSeason(
  color: ProductColor,
  colorSeason: ColorSeason,
  colorTemperature: ColorTemperature,
  contrastLevel: ContrastLevel,
  hairColor: HairColor
): Product[] {
  return getProductsByColor(color)
}

/**
 * Получить топ рекомендованных цветов для цветотипа
 * Возвращает все уникальные цвета из товаров соответствующего сезона
 */
export function getTopRecommendedColors(
  colorSeason: ColorSeason,
  colorTemperature: ColorTemperature,
  contrastLevel: ContrastLevel,
  hairColor: HairColor,
  limit: number = 6
): ProductColor[] {
  // Получаем все товары соответствующего сезона
  const productSeason = SEASON_TO_PRODUCT_SEASON[colorSeason]
  const products = getProductsBySeason(productSeason)
  
  // Получаем уникальные цвета из всех товаров сезона
  const colors = Array.from(new Set(products.map(p => p.color)))
  
  return colors.slice(0, limit)
}

