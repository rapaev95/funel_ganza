import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClientInstance: SupabaseClient | null = null

/**
 * Получает клиентский клиент Supabase с anon key
 * Используется в клиентских компонентах (с 'use client')
 * Соблюдает Row Level Security (RLS) политики
 * 
 * ✅ Безопасно использовать в браузере
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseClientInstance) {
    return supabaseClientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClientInstance
}

/**
 * Клиентский клиент Supabase (ленивая инициализация)
 * Проверка переменных окружения происходит только при первом использовании
 */
export const supabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

