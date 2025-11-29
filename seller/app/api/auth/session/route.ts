import { NextRequest, NextResponse } from 'next/server'
import { TelegramUser } from '@/app/layout'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userCookie = request.cookies.get('telegram_user')
    
    if (!userCookie) {
      return NextResponse.json({ user: null })
    }

    const user: TelegramUser = JSON.parse(userCookie.value)
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}

