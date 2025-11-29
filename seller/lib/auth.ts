import { supabaseClient } from './supabase-client'
import { Seller } from '@/types/seller'

/**
 * Получить текущего авторизованного seller
 */
export async function getCurrentSeller(): Promise<Seller | null> {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return null
    }

    // Получаем seller по telegram_id из user metadata
    const telegramId = user.user_metadata?.telegram_id || user.id
    
    const { data: seller, error } = await supabaseClient
      .from('sellers')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()

    if (error || !seller) {
      return null
    }

    return seller as Seller
  } catch (error) {
    console.error('Error getting current seller:', error)
    return null
  }
}

/**
 * Проверить, авторизован ли пользователь
 */
export async function isAuthenticated(): Promise<boolean> {
  const seller = await getCurrentSeller()
  return seller !== null
}


