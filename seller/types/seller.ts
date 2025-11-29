// Типы для seller

export interface Seller {
  id: string
  telegram_id: number
  brand_name: string
  category: 'male' | 'female' | 'unisex'
  logo_url?: string
  wb_link?: string
  ozon_link?: string
  allow_cross_looks: boolean
  subscription_id?: string
  created_at: string
  updated_at: string
}

export type SubscriptionTier = 'start' | 'pro' | 'enterprise' | 'trial'

export interface Subscription {
  id: string
  seller_id: string
  tier: SubscriptionTier
  start_date: string
  end_date?: string
  is_active: boolean
  created_at: string
}

export interface Balance {
  seller_id: string
  amount: number
  currency: string
  updated_at: string
}

export interface Notification {
  id: string
  seller_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}


