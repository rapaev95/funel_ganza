import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ru', 'kk', 'en', 'pt-BR'],

  // Used when no locale matches
  defaultLocale: 'ru',

  // Always use locale prefix for clarity and avoiding middleware issues
  localePrefix: 'always'
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)


