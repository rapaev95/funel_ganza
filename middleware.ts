import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Создаем middleware для обработки локалей
const intlMiddleware = createMiddleware(routing)

export default intlMiddleware

export const config = {
  // Обрабатываем все пути, кроме статических файлов и API routes
  matcher: [
    // Включаем все пути, кроме:
    // - api routes
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - статические файлы (.*\..*)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Также обрабатываем корневой путь
    '/',
  ],
}

