const createNextIntlPlugin = require('next-intl/plugin')

// Используем относительный путь - next-intl плагин сам обработает его правильно
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

