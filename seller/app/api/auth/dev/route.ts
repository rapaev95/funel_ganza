import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface DevUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Разрешаем только в режиме разработки
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Dev login is not available in production' },
      { status: 403 }
    )
  }

  try {
    const user: DevUser = await request.json()

    // Сохраняем/обновляем пользователя в Supabase
    try {
      const { data: seller, error } = await supabase
        .from('sellers')
        .select('id, tg_user_id, name, email, subscription_status')
        .eq('tg_user_id', user.id.toString())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Supabase error:', error)
      }

      // Если пользователь не найден, создаем нового
      if (!seller) {
        const { data: newSeller, error: insertError } = await supabase
          .from('sellers')
          .insert({
            tg_user_id: user.id.toString(),
            name: `${user.first_name} ${user.last_name || ''}`.trim(),
            email: user.username ? `${user.username}@dev.local` : null,
            subscription_status: 'trial',
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 дней trial
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error creating seller:', insertError)
        }
      }
    } catch (supabaseError) {
      // Если Supabase не настроен, продолжаем без сохранения в БД
      console.warn('Supabase not configured, skipping database save:', supabaseError)
    }

    const response = NextResponse.json({ success: true, user })

    // Устанавливаем cookie с данными пользователя
    response.cookies.set('telegram_user', JSON.stringify(user), {
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // Нужно для клиентского доступа
    })

    return response
  } catch (error: any) {
    console.error('Dev auth error:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка авторизации' },
      { status: 500 }
    )
  }
}

