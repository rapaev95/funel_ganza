import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match ONLY page routes - explicit and minimal
  matcher: [
    '/',                                    // Root path
    '/(ru|kk|en|pt-BR)(/.*)?'              // Locale paths with optional sub-paths
  ]
};

