import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Публичные роуты (не требуют авторизации)
  const publicRoutes = ['/auth', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // API роуты - пропускаем без проверки авторизации (они сами обрабатывают авторизацию)
  const isApiRoute = pathname.startsWith('/api/')
  if (isApiRoute) {
    return NextResponse.next()
  }

  // Статические файлы - пропускаем
  if (
    pathname.startsWith('/_next/') || 
    pathname.startsWith('/product/') || 
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  const userCookie = request.cookies.get('telegram_user')

  // Если пользователь не авторизован и пытается зайти на защищенный роут
  if (!isPublicRoute && !userCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Если пользователь авторизован и пытается зайти на /auth, перенаправляем на dashboard
  if (pathname === '/auth' && userCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - static files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
}

