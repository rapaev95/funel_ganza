import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware({
  ...routing,
  // Отключаем автоопределение языка из заголовков браузера
  localeDetection: false
})

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/app',
    '/app/:path*',
    '/(ru|kk|en|pt-BR)/:path*'
  ]
}

