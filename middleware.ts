import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

// Создаем middleware для обработки локалей
const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // Логируем API запросы в development
  if (process.env.NODE_ENV === 'development' && request.nextUrl.pathname.startsWith('/api')) {
    const startTime = Date.now()
    console.log(`[API Request] ${request.method} ${request.nextUrl.pathname}`)
    
    // Для API routes просто пропускаем дальше
    const response = NextResponse.next()
    response.headers.set('X-Request-Time', `${Date.now() - startTime}ms`)
    return response
  }

  // Применяем intl middleware для обработки локалей
  return intlMiddleware(request)
}

export const config = {
  // Обрабатываем все пути, кроме статических файлов и API routes
  matcher: [
    // Включаем все пути, кроме:
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Также обрабатываем корневой путь
    '/',
  ],
}

