const createNextIntlPlugin = require('next-intl/plugin')

// Point to i18n/request.ts for config, but middleware is custom
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
}

module.exports = withNextIntl(nextConfig)

