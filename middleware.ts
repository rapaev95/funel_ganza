import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /foto (static assets)
  // - All files with an extension (e.g. .ico, .jpg, .png)
  matcher: ['/((?!api|_next|_vercel|foto|.*\\..*).*)']
};

