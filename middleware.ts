import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Skip API routes, Next.js internals, and all static files
  matcher: [
    // Match root and locale paths
    '/',
    '/(ru|kk|en|pt-BR)/:path*',
    
    // Skip all files with extensions and special paths
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

