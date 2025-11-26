import { ColorSeason } from '@/types/result'

export type ProductColor = 
  | 'black' | 'white' | 'fuchsia' | 'purple' | 'red' | 'turquoise'
  | 'golden' | 'lemon' | 'mint' | 'peach' | 'salmon' | 'skyblue'
  | 'dustyblue' | 'dustyrose' | 'gray' | 'lavender' | 'lilac' | 'powder'
  | 'terracotta'

export interface Product {
  id: string
  name: string
  image: string
  imageWithoutPeople?: string
  price: {
    old: number // в рублях
    new: number // в рублях
  }
  description: string
  color: ProductColor
  season: 'winter' | 'spring' | 'summer' | 'autumn'
  link: string // ссылка на Wildberries
  availableSizes: ('S' | 'M' | 'L' | 'XL')[]
}

// Базовые цены в рублях
// Новая цена: 5354 руб
// Старая цена: эквивалент 85570 тенге по курсу 5.5 = 15558 руб
const BASE_PRICE_RUB = 5354
const BASE_OLD_PRICE_RUB = Math.round(85570 / 5.5) // 15558 рублей (эквивалент 85570 тенге)

// Маппинг цветов к названиям
export const COLOR_NAMES: Record<ProductColor, string> = {
  black: 'Черный',
  white: 'Белый',
  fuchsia: 'Фуксия',
  purple: 'Фиолетовый',
  red: 'Красный',
  turquoise: 'Бирюзовый',
  golden: 'Золотой',
  lemon: 'Лимонный',
  mint: 'Мятный',
  peach: 'Персиковый',
  salmon: 'Лососевый',
  skyblue: 'Небесно-голубой',
  dustyblue: 'Пыльно-голубой',
  dustyrose: 'Пыльная роза',
  gray: 'Серый',
  lavender: 'Лавандовый',
  lilac: 'Сиреневый',
  powder: 'Пудровый',
  terracotta: 'Терракотовый',
}

// Все товары - только из папки /product/hoodie/
export const PRODUCTS: Product[] = [
  {
    id: 'hoodie-black',
    name: 'Худи Streetwear Черный',
    image: '/product/hoodie/woman/image_2025-11-25_18-02-46.png',
    imageWithoutPeople: '/product/hoodie/withoutpeople/image_2025-11-25_18-02-25.png',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear, черный цвет',
    color: 'black',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-white',
    name: 'Худи Streetwear Белый',
    image: '/product/hoodie/woman/image_2025-11-25_18-03-20.png',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear, белый цвет',
    color: 'white',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-fuchsia',
    name: 'Худи Streetwear Фуксия',
    image: '/product/hoodie/woman/image_2025-11-25_18-03-38.png',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear, фуксия',
    color: 'fuchsia',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-purple',
    name: 'Худи Streetwear Фиолетовый',
    image: '/product/hoodie/woman/image_2025-11-25_18-03-51.png',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear, фиолетовый цвет',
    color: 'purple',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-red',
    name: 'Худи Streetwear Красный',
    image: '/product/hoodie/woman/image_2025-11-25_18-04-24.png',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear, красный цвет',
    color: 'red',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  // Товары из папки withoutpeople
  {
    id: 'hoodie-withoutpeople-1',
    name: 'Худи Streetwear',
    image: '/product/hoodie/withoutpeople/image_2025-11-25_18-02-25.png',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear',
    color: 'black',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-withoutpeople-2',
    name: 'Худи Streetwear',
    image: '/product/hoodie/withoutpeople/photo_2025-11-25_18-06-19.jpg',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear',
    color: 'black',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-withoutpeople-3',
    name: 'Худи Streetwear',
    image: '/product/hoodie/withoutpeople/photo_2025-11-25_18-06-21.jpg',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear',
    color: 'black',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'hoodie-withoutpeople-4',
    name: 'Худи Streetwear',
    image: '/product/hoodie/withoutpeople/photo_2025-11-25_18-06-25.jpg',
    price: { old: BASE_OLD_PRICE_RUB, new: BASE_PRICE_RUB },
    description: 'Оверсайз худи в стиле streetwear',
    color: 'black',
    season: 'winter',
    link: 'https://www.wildberries.ru/seller/86144#',
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
]

/**
 * Получить все товары
 */
export function getAllProducts(): Product[] {
  return PRODUCTS
}

/**
 * Получить товары по сезону
 */
export function getProductsBySeason(season: 'winter' | 'spring' | 'summer' | 'autumn'): Product[] {
  return PRODUCTS.filter(p => p.season === season)
}

/**
 * Получить товары по цвету
 */
export function getProductsByColor(color: ProductColor): Product[] {
  return PRODUCTS.filter(p => p.color === color)
}

/**
 * Получить товар по ID
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

