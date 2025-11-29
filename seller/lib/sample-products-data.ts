export interface Product {
  id: string
  name: string
  sku: string
  price: number
  oldPrice?: number
  image: string
  marketplace: 'WB' | 'Ozon' | 'Both'
  status: 'active' | 'inactive' | 'syncing' | 'error'
  category?: string
  brand?: string
  stock?: number
  views?: number
  clicks?: number
  lastSynced?: string
}

export const sampleProductsData: Product[] = [
  {
    id: '1',
    name: 'Худи оверсайз серое',
    sku: 'WB-12345678',
    price: 2490,
    oldPrice: 3490,
    image: '/product/hoodie/woman/image_2025-11-25_18-02-46.png',
    marketplace: 'WB',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 15,
    views: 1250,
    clicks: 89,
    lastSynced: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Худи с капюшоном черное',
    sku: 'WB-12345679',
    price: 1890,
    image: '/product/hoodie/woman/image_2025-11-25_18-03-20.png',
    marketplace: 'WB',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 8,
    views: 890,
    clicks: 45,
    lastSynced: '2025-01-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Худи оверсайз бежевое',
    sku: 'OZ-98765432',
    price: 2190,
    oldPrice: 2790,
    image: '/product/hoodie/woman/image_2025-11-25_18-03-38.png',
    marketplace: 'Ozon',
    status: 'syncing',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 12,
    views: 650,
    clicks: 32,
    lastSynced: '2025-01-15T11:00:00Z'
  },
  {
    id: '4',
    name: 'Худи с принтом розовое',
    sku: 'WB-12345680',
    price: 3490,
    image: '/product/hoodie/woman/image_2025-11-25_18-03-51.png',
    marketplace: 'Both',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 5,
    views: 2100,
    clicks: 156,
    lastSynced: '2025-01-15T10:45:00Z'
  },
  {
    id: '5',
    name: 'Худи базовое черное',
    sku: 'WB-12345681',
    price: 2790,
    oldPrice: 3290,
    image: '/product/hoodie/woman/image_2025-11-25_18-04-24.png',
    marketplace: 'WB',
    status: 'inactive',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 0,
    views: 450,
    clicks: 18,
    lastSynced: '2025-01-14T15:20:00Z'
  },
  {
    id: '6',
    name: 'Худи оверсайз белое',
    sku: 'OZ-98765433',
    price: 1290,
    image: '/product/hoodie/woman/photo_2025-11-25_18-05-23.jpg',
    marketplace: 'Ozon',
    status: 'error',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 20,
    views: 320,
    clicks: 12,
    lastSynced: '2025-01-14T12:00:00Z'
  },
  {
    id: '7',
    name: 'Худи с капюшоном серое',
    sku: 'WB-12345682',
    price: 1990,
    image: '/product/hoodie/woman/photo_2025-11-25_18-05-25.jpg',
    marketplace: 'WB',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 10,
    views: 780,
    clicks: 52,
    lastSynced: '2025-01-15T08:30:00Z'
  },
  {
    id: '8',
    name: 'Худи оверсайз бежевое',
    sku: 'OZ-98765434',
    price: 2290,
    image: '/product/hoodie/woman/photo_2025-11-25_18-06-11.jpg',
    marketplace: 'Ozon',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 7,
    views: 920,
    clicks: 67,
    lastSynced: '2025-01-15T09:00:00Z'
  },
  {
    id: '9',
    name: 'Худи без людей серое',
    sku: 'WB-12345683',
    price: 1790,
    image: '/product/hoodie/withoutpeople/image_2025-11-25_18-02-25.png',
    marketplace: 'WB',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 18,
    views: 1100,
    clicks: 78,
    lastSynced: '2025-01-15T10:00:00Z'
  },
  {
    id: '10',
    name: 'Худи базовое белое',
    sku: 'OZ-98765435',
    price: 1590,
    oldPrice: 1990,
    image: '/product/hoodie/withoutpeople/photo_2025-11-25_18-06-19.jpg',
    marketplace: 'Ozon',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 14,
    views: 650,
    clicks: 41,
    lastSynced: '2025-01-15T11:15:00Z'
  },
  {
    id: '11',
    name: 'Худи оверсайз серое',
    sku: 'WB-12345684',
    price: 2390,
    image: '/product/hoodie/withoutpeople/photo_2025-11-25_18-06-21.jpg',
    marketplace: 'WB',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 12,
    views: 980,
    clicks: 64,
    lastSynced: '2025-01-15T09:30:00Z'
  },
  {
    id: '12',
    name: 'Худи с капюшоном черное',
    sku: 'OZ-98765436',
    price: 2090,
    oldPrice: 2590,
    image: '/product/hoodie/withoutpeople/photo_2025-11-25_18-06-25.jpg',
    marketplace: 'Ozon',
    status: 'active',
    category: 'Худи',
    brand: 'Vibelook',
    stock: 9,
    views: 750,
    clicks: 48,
    lastSynced: '2025-01-15T10:15:00Z'
  }
]

