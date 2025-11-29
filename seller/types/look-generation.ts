import { LookStyle, ColorSeason } from './look'
import { Product } from '@/lib/sample-products-data'

export interface SDXLGenerationSettings {
  prompt: string
  style: LookStyle
  colorSeason: ColorSeason
  numVariants: number // 1-5
  imageSize: '512x512' | '768x768' | '1024x1024'
  guidanceScale: number // 1-20
  steps: number // 20-50
}

export interface OtherSellerProduct {
  id: string
  name: string
  image: string
  price: number
  category?: string
  sellerId: string
  sellerName?: string
}

export interface LookGenerationRequest {
  productId: string
  product: Product
  sdxlSettings: SDXLGenerationSettings
  additionalProducts: OtherSellerProduct[]
  userId: string
}

export interface LookGenerationResult {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  results?: GeneratedLook[]
  error?: string
}

export interface GeneratedLook {
  id: string
  imageUrl: string
  prompt: string
  style: LookStyle
  colorSeason: ColorSeason
}


